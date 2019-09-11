/* eslint-disable function-paren-newline */
const { lstatSync, readdirSync } = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')

/**
 * @param {Logger} _logger
 */
module.exports = class Postgres {
  /**
   *
   * @param {Logger} logger
   * @param endpointConnection
   * @param connectionOptions
   * @returns {*}
   */
  constructor(logger, endpointConnection, connectionOptions) {
    this._logger = logger

    if (typeof Postgres.instance === 'object') { return Postgres.instance }

    /** Create sequelize instance */
    this.sequelizeClient = new Sequelize(endpointConnection, connectionOptions)
    this.models = {}

    const dir = path.join(__dirname, '/../../models/postgres')
    readdirSync(dir)
      .filter(source => lstatSync(path.join(dir, source)).isDirectory() && !source.includes('__tests__'))
      .forEach((modelDir) => {
        const model = this.sequelizeClient.import(path.join(dir, modelDir, '/index.js'))
        this.models[model.name] = model
      })

    const { models } = this

    Object.keys(models).forEach((key) => {
      const model = models[key]

      if (model.associate) {
        model.associate(models)
      }
    })

    Postgres.instance = this
    return this
  }

  async syncConnection() {
    try {
      await this.sequelizeClient.authenticate()
      // this.sequelizeClient.sync({ force: true })
      // this.sequelizeClient.sync({ alter: true })
      this.sequelizeClient.sync()
    } catch (error) {
      this._logger.error({ message: 'DB is synchronized', error })
      throw error
    }
  }
}
