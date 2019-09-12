'use strict'

const fs = require('fs')
const path = require('path')

const DEVELOPMENT = 'development'
const PRODUCTION = 'production'
const TEST = 'test'

/**
 * @property {number} port
 * @property {boolean} clusterMode
 * @property {string} postgresUrl
 * @property {string} redisUrl
 * @property {Object} sequelizeConnectionOptions
 * @property {string} facebookAppId
 * @property {string} facebookAppSecret
 * @property {string} googleAppId
 * @property {string} googleAppSecret
 * @property {string} twitterClientID
 * @property {string} twitterClientSecret
 * @property {string} authSecret
 * @property {string} authTokenExpirationTime
 */
class Config {
  /**
   * @property {number} port
   * @property {boolean} clusterMode
   * @property {string} postgresUrl
   * @property {string} redisUrl
   * @property {Object} sequelizeConnectionOptions
   * @property {string} facebookAppId
   * @property {string} facebookAppSecret
   * @property {string} googleAppId
   * @property {string} googleAppSecret
   * @property {string} twitterClientID
   * @property {string} twitterClientSecret
   * @property {string} authSecret
   * @property {string} authTokenExpirationTime
   * @returns {void} Nothing
   */
  constructor() {
    this.port = null
    this.clusterMode = null
    this.postgresUrl = null
    this.redisUrl = null
    this.sequelizeConnectionOptions = null
    this.facebookAppId = null
    this.facebookAppSecret = null
    this.googleAppId = null
    this.googleAppSecret = null
    this.twitterClientID = null
    this.twitterClientSecret = null
    this.authSecret = null
    this.authTokenExpirationTime = null

    let filePrefix
    switch (process.env.NODE_ENV) {
      case DEVELOPMENT: {
        filePrefix = 'dev'
        break
      }
      case PRODUCTION: {
        filePrefix = 'prod'
        break
      }
      case TEST: {
        filePrefix = 'test'
        break
      }
      default: {
        throw new Error('Incorrect NODE_ENV!')
      }
    }

    const filePath = path.join(__dirname, `config.${filePrefix}.json`)

    if (fs.existsSync(filePath)) {
      const configs = require(`./config.${filePrefix}.json`)

      this.port = configs.port
      this.clusterMode = configs.clusterMode
      this.postgresUrl = configs.postgresUrl
      this.redisUrl = configs.redisUrl
      this.sequelizeConnectionOptions = configs.sequelizeConnectionOptions
      this.facebookAppId = configs.facebookAppId
      this.facebookAppSecret = configs.facebookAppSecret
      this.googleAppId = configs.googleAppId
      this.googleAppSecret = configs.googleAppSecret
      this.twitterClientID = configs.twitterClientID
      this.twitterClientSecret = configs.twitterClientSecret
      this.authSecret = configs.authSecret
      this.authTokenExpirationTime = configs.authTokenExpirationTime
    } else {
      throw new Error(`Not found: ${filePath}`)
    }
  }
}

module.exports = new Config()
