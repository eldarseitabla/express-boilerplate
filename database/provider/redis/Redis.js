'use strict'

const redis = require('redis')

const Base = require('../Base')

/**
 * @memberOf module:database/provider
 * @instance
 */
class Redis extends Base {
  async syncConnection(redisUrl) {
    return redis.createClient(redisUrl)
  }
}

module.exports = Redis
