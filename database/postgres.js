'use strict'
/* eslint-disable function-paren-newline */
const { lstatSync, readdirSync } = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')

const BaseDatabase = require('./BaseDatabase')

/**
 * @param {Logger} _logger
 */
class Postgres extends BaseDatabase {
  /**
   *
   * @param {Logger} logger
   * @param endpointConnection
   * @param connectionOptions
   * @returns {*}
   */
  async syncConnection(logger, endpointConnection, connectionOptions) {
    try {
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

      Object.keys(this.models).forEach((key) => {
        const model = this.models[key]

        if (model.associate) {
          model.associate(this.models)
        }
      })
      await this.sequelizeClient.authenticate()
      // await this.sequelizeClient.sync({ force: true })
      // await this.sequelizeClient.sync({ alter: true })
      await this.sequelizeClient.sync()
    } catch (error) {
      logger.error({ message: 'database.postgres.syncConnection', error })
      throw error
    }
  }
}

module.exports = new Postgres()
