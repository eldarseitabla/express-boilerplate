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
  constructor(app, router, config) {
    this._app = app
    this._router = router
    this._config = config
    this.postgres = null
    this.redis = null
  }

  async init() {
    this.postgres = await postgres.syncConnection(this._config.postgres.url, this._config.postgres.options)

    this.redis = await redis.syncConnection(this._config.redisUrl)

    // app.use('/auth', auth.getRouter(router, this.postgres, this.redis, config))

    this._app.use('/profiles', profile.getRouter(this._router))
  }
}

Dependencies.prototype.Dependencies = Dependencies

module.exports = Dependencies
