'use strict'

const redis = require('redis')

const BaseDatabase = require('./BaseDatabase')

class Redis extends BaseDatabase {
  async syncConnection(redisUrl) {
    return redis.createClient(redisUrl)
  }
}

module.exports = new Redis()
