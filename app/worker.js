const express = require('express')

const { Paths } = require('../constants')

const { POSTGRES_URL } = process.env

const {
  Config,
  Logger,
  Postgres,
  Redis,
} = require('../services')

const {
  AuthService,
  ProfileService,
} = require('../services')

const app = express()
const router = express.Router()

class Worker {
  constructor() {
    this._logger = new Logger(Paths.PATH_LOGS)
    this._config = new Config(this._logger)
    this._postgres = new Postgres(this._logger, POSTGRES_URL, { logging: false, dialect: 'postgres', operatorsAliases: false })
    this._redis = new Redis(this._config)
    this._server = null
  }

  async init() {
    try {
      await this._postgres.syncConnection()

      const authService = new AuthService(router, this._postgres, this._redis, this._config, this._postgres.User, this._logger)
      app.use('/auth', authService.getRouter())

      const profileService = new ProfileService(router)
      app.use('/profiles', profileService.getRouter())

      this._logger.info('Successfully configured!')
    } catch (err) {
      this._logger.error({ message: 'Unable to setup config Error', error: err })
      throw err
    }
  }

  start() {
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

  stop(signal) {
    return async () => {
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
}

module.exports = new Worker()
