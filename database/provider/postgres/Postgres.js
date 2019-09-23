'use strict'
/* eslint-disable function-paren-newline */
const { lstatSync, readdirSync } = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const logger = require('log4js').getLogger('[database.postgres]')

const Base = require('../Base')

/**
 * @memberOf module:database/provider
 * @instance
 */
class Postgres extends Base {
  /**
   *
   * @param {string} endpointConnection
   * @param {Object} options
   * @returns {*}
   */
  async syncConnection(endpointConnection, options) {
    /** Create sequelize instance */
    this.sequelizeClient = new Sequelize(endpointConnection, options)
    this.models = {}

    const dir = path.join(__dirname, '/../../../database/models/postgres')
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
    try {
      await this.sequelizeClient.authenticate()
      // await this.sequelizeClient.sync({ force: true })
      // await this.sequelizeClient.sync({ alter: true })
      await this.sequelizeClient.sync()
      return this
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = Postgres
