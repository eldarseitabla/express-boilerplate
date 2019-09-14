'use strict'

const express = require('express')

const dependencies = require('./dependencies')

const app = express()
const router = express.Router()

class Server {
  constructor() {
    this._server = null
  }

  async init(config, log4js) {
    this._config = config
    this._logger = log4js.getLogger('[app.server]')
    await dependencies.init(app, router, this._config, log4js)
    this._logger.info('Successfully configured!')
  }

  async start() {
    const { PORT, HOST } = process.env
    this._server = app.listen(PORT, HOST, (error) => {
      if (!error) {
        this._logger.info(`Running a API server at http://${HOST}:${PORT}`)
      } else {
        this._logger.error({ message: 'Error start server', error })
        setTimeout(() => this.start(), 1000)
      }
    })
  }

  async stop(signal) {
    this._logger.info(`Received signal: ${signal}, running closing connections...`)
    await this._postgres.sequelizeClient.close()

    // await redisClient.end(true)

    await this._server.close(() => {
      this._logger.info('Closed out remaining connections.')
      process.exit()
    })

    // if after
    await setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down') // eslint-disable-line
      this._logger.error({ message: 'Could not close connections in time, forcefully shutting down', error: new Error() })
      process.exit()
    }, 10 * 1000)
  }
}

module.exports = new Server()
