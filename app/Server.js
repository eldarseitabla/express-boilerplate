'use strict'

const express = require('express')
const logger = require('log4js').getLogger('[app.server]')

const Dependencies = require('./Dependencies')

const app = express()
const router = express.Router()

class Server {
  constructor(config) {
    this._self = {}
    this._config = config
    this._dependencies = new Dependencies(app, router, this._config)
  }

  async run() {
    await this._preload()

    const HOST = this._config.host
    const PORT = this._config.port
    this._self = app.listen(PORT, HOST, (error) => {
      if (!error) {
        logger.info(`Success running on the host: ${HOST} | port: ${PORT}| PID: ${process.pid}`)
      } else {
        logger.error({ message: 'Error start server', error })
        setTimeout(() => this.start(), 1000)
      }
    })
  }

  async _preload() {
    await this._dependencies.init(app, router, this._config)
    process.on('SIGTERM', this._stop('SIGTERM'))
    process.on('SIGINT', this._stop('SIGINT'))
  }

  _stop(signal) {
    return async() => {
      logger.info(`Received signal: ${signal}, running closing connections...`)
      await this._dependencies.postgres.sequelizeClient.close()

      await this._dependencies.redis.end(true)

      await this._self.close(() => {
        logger.info('Closed out remaining connections.')
        process.exit()
      })

      // if after
      await setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down') // eslint-disable-line
        logger.error({ message: 'Could not close connections in time, forcefully shutting down', error: new Error() })
        process.exit(1)
      }, 10 * 1000)
    }
  }
}

module.exports = Server
