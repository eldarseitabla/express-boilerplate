'use strict'

const express = require('express')
const logger = require('log4js').getLogger('[app.server]')

const dependencies = require('./dependencies')

const app = express()
const router = express.Router()

class Server {
  constructor() {
    this._config = {}
    this._server = {}
    this._clusterMode = false
  }

  async init(config, clusterMode = false) {
    this._config = config
    this._clusterMode = clusterMode
    await dependencies.init(app, router, this._config)
    if (!this._clusterMode) {
      process.on('SIGTERM', this.stop('SIGTERM'))
      process.on('SIGINT', this.stop('SIGINT'))
    }
    logger.info('Successfully configured!')
  }

  async start() {
    const HOST = this._config.host
    const PORT = this._config.port
    this._server = app.listen(PORT, HOST, (error) => {
      if (!error) {
        logger.info(`Running a API server at http://${HOST}:${PORT}`)
      } else {
        logger.error({ message: 'Error start server', error })
        setTimeout(() => this.start(), 1000)
      }
    })
  }

  stop(signal) {
    return async() => {
      logger.info(`Received signal: ${signal}, running closing connections...`)
      await dependencies.postgres.sequelizeClient.close()

      await dependencies.redis.end(true)

      await this._server.close(() => {
        logger.info('Closed out remaining connections.')
        if (!this._clusterMode) {
          process.exit()
        }
      })

      // if after
      await setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down') // eslint-disable-line
        logger.error({ message: 'Could not close connections in time, forcefully shutting down', error: new Error() })
        if (!this._clusterMode) {
          process.exit(1)
        }
      }, 10 * 1000)
    }
  }
}

module.exports = new Server()
