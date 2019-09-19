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
} = require('../component')

class Dependencies {
  constructor() {
    this.postgres = null
    this.redis = null
  }

  async init(app, router, config) {
    this.postgres = await postgres.syncConnection(config.postgresUrl, { logging: false, dialect: 'postgres', operatorsAliases: false })

    this.redis = await redis.syncConnection(config.redisUrl)

    // app.use('/auth', auth.getRouter(router, this.postgres, this.redis, config))

    app.use('/profiles', profile.getRouter(router))
  }
}

Dependencies.prototype.Dependencies = Dependencies

module.exports = new Dependencies()
