'use strict'

const cluster = require('cluster')
const logger = require('log4js').getLogger('[app.master]')

class ClusterApp {
  constructor() {
    this._shutdownInProgress = false
    this._hasCleanWorkerExit = true
  }

  async init(config) {
    this._config = config
  }

  async stop(signal) {
    if (!cluster.isMaster) { return }

    logger.info(`Master got signal ${signal}`)
    logger.info('stop listening')

    const workers = []
    for (const id in cluster.workers) {
       workers.push(new Promise(resolve => {
        let timeout

        cluster.workers[id].on('listening', async(address) => {

          await cluster.workers[id].send(signal)
          await cluster.workers[id].disconnect()

          timeout = setTimeout(() => {
            cluster.workers[id].kill()
          }, 2000)

        })

        cluster.workers[id].on('disconnect', () => {
          clearTimeout(timeout)
          resolve(cluster.workers[id].process.pid)
        })
      }))
    }

    for await (const id of workers) {
      console.log('Died worker:' + id)
    }
    this.logAndExit(this._hasCleanWorkerExit)
  }

  async start() {
    if (cluster.isMaster) {

      logger.info('Starting Master')
      process.on('SIGTERM', () => this.stop('SIGTERM'))
      process.on('SIGINT', () => this.stop('SIGINT'))
      await this.bootWorkers(4)

    } else if (cluster.isWorker) {
      const server = require('./server.js')
      await server.init(this._config, true)
      server.start()
      process.on('message', async(msg) => {
        if (msg === 'SIGTERM' || msg === 'SIGINT') {
          // Initiate graceful close of any connections to server
          await server.stop(msg)
        }
      })
    }
  }

  async bootWorkers(numWorkers) {
    logger.info(`Setting ${numWorkers} workers...`)

    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork() // create the workers
    }

    // Setting up lifecycle event listeners for worker processes
    cluster.on('online', async(worker) => {
      logger.info(`worker process ${worker.process.pid} is online`)
    })

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`worker ${worker.process.pid} exited with code ${code} and signal ${signal}`)
      if (this._shutdownInProgress && code !== 0) {
        this._hasCleanWorkerExit = false
      }
    })

    cluster.on('disconnect', (worker) => {
      logger.info(`worker process ${worker.process.pid} has disconnected`)
    })
  }

  logAndExit(_hasCleanWorkerExit) {
    logger.info(`logAndExit ${_hasCleanWorkerExit}`)
    process.exit(_hasCleanWorkerExit)
  }
}

module.exports = new ClusterApp()
