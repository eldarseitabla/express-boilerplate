'use strict'

/**
 * Module dependencies.
 */

const {
  Postgres,
  Redis,
} = require('../db')

const {
  Auth,
  Profile,
} = require('../components')

class Dependencies {
  async init(app, router, config, logger) {

    this._postgres = new Postgres(this._logger, POSTGRES_URL, { logging: false, dialect: 'postgres', operatorsAliases: false })
    this._redis = new Redis(this._config)

    await this._postgres.syncConnection()

    const auth = new Auth(router, this._postgres, this._redis, this._config, this._postgres.User, this._logger)
    app.use('/auth', auth.getRouter())

    const profile = new Profile(router)
    app.use('/profiles', profile.getRouter())
  }
}

Dependencies.prototype.Dependencies = Dependencies

module.exports = new Dependencies()
