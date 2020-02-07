'use strict'

const postgresProvider = require('./postgres/postgres.provider')
const mongoProvider = require('./mongo/mongo.provider')
const redisProvider = require('./redis/redis.provider')

const nameProviders = require('./name.providers')
const config = require('../../config/config.json')

const databaseProviders = [
  {
    getConnection: async() => {
      const connection = await mongoProvider.connect(config.mongo)
      return {
        provide: nameProviders.MONGODB,
        connection
      }
    },
  },
  {
    getConnection: async() => {
      const connection = await redisProvider.connect(config.redis)
      return {
        provide: nameProviders.REDIS,
        connection
      }
    },
  },
  {
    getConnection: async() => {
      const connection = await postgresProvider.connect(config.postgres)
      return {
        provide: nameProviders.POSTGRES,
        connection
      }
    },
  }
]

module.exports = {
  databaseProviders
}
