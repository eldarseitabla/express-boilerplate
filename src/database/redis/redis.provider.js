'use strict'

const Redis = require('ioredis')

const connect = async(config) => {
  const redis = new Redis(config.url, config.options)
  await redis.set('foo', 'bar')
  await redis.get('foo')
  await redis.del('foo')
  return redis
}

module.exports = { connect }
