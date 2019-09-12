'use strict'

/**
 * Module dependencies.
 */

const {
  postgres,
  redis,
} = require('../database')

const {
  auth,
  profile,
} = require('../components')

class Dependencies {
  async init(app, router, config, logger) {
    const postgresConnection = await postgres.syncConnection(logger, config.postgresUrl, { logging: false, dialect: 'postgres', operatorsAliases: false })

    const redisConnection = await redis.syncConnection(config.redisUrl)

    app.use('/auth', auth.getRouter(router, postgresConnection, redisConnection, config, logger))

    app.use('/profiles', profile.getRouter(router, logger))
  }
}

Dependencies.prototype.Dependencies = Dependencies

module.exports = new Dependencies()
