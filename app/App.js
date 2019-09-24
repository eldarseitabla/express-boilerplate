'use strict'

const log4js = require('log4js')
const logger = log4js.getLogger('[app.App]')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length - 1
const Server = require('./Server')

let heapdump

const wait = (ms) => new Promise(
  resolve => setTimeout(() => resolve(), ms)
)


/**
 * @memberOf module:app
 */
class Application {

  /**
   * Main application
   *
   * @param {Config} config
   * @property {Config} _config
   * @property {Server} _server
   * @property {?TimeoutID} _timeout
   */
  constructor(config) {
    if (this._isHeapdump()) {
      this._heapdumpStart()
    }

    this._config = config

    this._server = new Server(this._config)

    this._timeout = null

    this._bindHandlers()
  }

  /**
   * Run application
   *
   * @param {boolean} cluster
   * @returns {Promise<void>}
   */
  async run(cluster = true) {
    if (cluster && this._isMaster() && !this._noCluster()) {
      const workerCount = this._getWorkerCount()
      for (let i = 1; i <= workerCount; i++) {
        this._fork()
      }

      this._bindOnExitHandler()
    } else {
      this._initStartTimeout(this._config.startTimeoutMs)
      await this._preload()
    }
  }

  _isHeapdump() {
    return process.argv.includes('--heapdump')
  }

  _heapdumpStart() {
    const timeout = process.argv[process.argv.indexOf('--heapdump') + 1] || 10
    logger.info('Start heapdump, die in', timeout, 'sec')
    heapdump = require('heapdump')
    wait(parseInt(timeout) * 1000)
      .then(() => this._heapdumpEnd())
      .then(() => this._exit())
  }

  async _heapdumpEnd() {
    return new Promise(
      resolve =>
        heapdump.writeSnapshot(function(err, filename) {
          if (err) {
            logger.error(err)
            return resolve()
          }

          logger.info('dump written to', filename)
          resolve()
        })
    )
  }

  _bindOnExitHandler() {
    cluster.on('exit', worker => {
      logger.error(`worker ${worker.process.pid} died`)
      this._fork()
    })
  }

  _isMaster() {
    return cluster.isMaster
  }

  _noCluster() {
    return process.env.FUNCTIONAL_COVERAGE || this._isHeapdump()
  }

  _fork() {
    cluster.fork()
  }

  async _exit() {
    process.exit()
  }

  _getWorkerCount() {
    return this._config.clusterMode ? numCPUs : 1
  }

  async _preload() {
    try {
      await this._server.run()
    } catch (err) {
      logger.fatal(err)
      this._exit()
    }

    this._timeout && clearTimeout(this._timeout)
  }

  /**
   * Set start timeout to prevent forever loading
   *
   * @param {number} timeoutMs
   * @private
   */
  _initStartTimeout(timeoutMs) {
    this._timeout = setTimeout(() => {
      logger.error(
        `Can't start in ${timeoutMs}ms. ` +
        'The components which hasn\'t already started: ',
        this._injector.createInstanceQueue
      )
      this._exit()
    }, timeoutMs)
  }

  _bindHandlers() {
    process.on('unhandledRejection', (reason, p) => {
      logger.fatal('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
    })
    process.on('uncaughtException', err => {
      logger.fatal('Unhandled Exception at: ', err)
    })
  }
}
module.exports = Application
