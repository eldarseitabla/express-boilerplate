'use strict'

const cluster = require('cluster')

const processStr = `${cluster.isMaster ? 'master' : 'worker'} process ${process.pid}`

class Master {
  constructor() {
    this._shutdownInProgress = false
    this._hasCleanWorkerExit = true
  }

  async init(config, logger) {
    this._config = config
    this._logger = logger
  }

  gracefulClusterShutdown(signal) {
    return async() => {
      if (this._shutdownInProgress) { return }

      this._shutdownInProgress = true
      this._hasCleanWorkerExit = true

      this._logger.info(`Got ${signal} on ${processStr}. Graceful shutdown start at ${new Date().toISOString()}`)

      try {
        if (cluster.isMaster) {
          this._logger.info(`${processStr} - worker shutdown successful`)
          await this.shutdownWorkers(signal)
        } else if (cluster.isWorker) {
          await this.stop(signal) // stop yourself after the workers are shutdown if you are master
        }
        this._logger.info(`${processStr} shutdown successful`)
        this.logAndExit(this._hasCleanWorkerExit ? 0 : 1)
        process.exit(this._hasCleanWorkerExit ? 0 : 1)
      } catch (e) {
        this.logAndExit(1)
        process.exit(1)
      }
    }
  }

  async shutdownWorkers(signal) {
    if (!cluster.isMaster) { return }

    const wIds = Object.keys(cluster.workers)
    if (wIds.length === 0) { return }

    // Filter all the valid workers
    const workers = wIds.map(id => cluster.workers[id]).filter(v => v)
    let workersAlive = 0
    let funcRun = 0
    let interval = 0

    // Count the number of alive workers and keep looping until the number is zero.
    const fn = () => {
      funcRun += 1
      workersAlive = 0
      workers.forEach((worker) => {
        if (!worker.isDead()) {
          workersAlive += 1
          if (funcRun === 1) {
            // On the first execution of the function, send the received signal to all the workers
            worker.kill(signal)
          }
        }
      })
      this._logger.info(`${workersAlive} workers alive`)
      if (workersAlive === 0) {
        // Clear the interval when all workers are dead
        clearInterval(interval)
      }
    }
    interval = setInterval(fn, 500)
  }

  async stop(signal) {
    this._logger.info('stop listening')
    const server = require('./server.js')
    await server.stop(signal)()
    // stop listening
    // disconnect with db
    // any other cleanup
  }

  async start() {
    if (cluster.isMaster) {
      this._logger.info('Starting Master')
      await this.bootWorkers(4)
    } else if (cluster.isWorker) {
      const server = require('./server.js')
      await server.init()
      server.start()
    }
    process.on('SIGTERM', this.gracefulClusterShutdown('SIGTERM'))
    process.on('SIGINT', this.gracefulClusterShutdown('SIGINT'))
  }

  async bootWorkers(numWorkers) {
    this._logger.info(`Setting ${numWorkers} workers...`)

    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork() // create the workers
    }

    // Setting up lifecycle event listeners for worker processes
    cluster.on('online', async(worker) => {
      this._logger.info(`worker process ${worker.process.pid} is online`)
    })

    cluster.on('exit', (worker, code, signal) => {
      this._logger.info(`worker ${worker.process.pid} exited with code ${code} and signal ${signal}`)
      if (this._shutdownInProgress && code !== 0) {
        this._hasCleanWorkerExit = false
      }
    })

    cluster.on('disconnect', (worker) => {
      this._logger.info(`worker process ${worker.process.pid} has disconnected`)
    })
  }

  logAndExit(_hasCleanWorkerExit) {
    this._logger.info(`logAndExit ${_hasCleanWorkerExit}`)
    process.exit(_hasCleanWorkerExit)
  }
}

module.exports = new Master()
