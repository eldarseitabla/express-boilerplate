const redis = require('redis')

module.exports = class Redis {
  constructor(config) {
    this._config = config
    return redis.createClient(this._config.redisUrl)
  }
}
