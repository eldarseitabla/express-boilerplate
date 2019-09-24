'use strict'

const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const logger = log4js.getLogger('[config.index]')

const DEVELOPMENT = 'development'
const PRODUCTION = 'production'
const TEST = 'test'

/**
 * @property {string} host
 * @property {number} port
 * @property {boolean} clusterMode
 * @property {Object} postgres
 * @property {string} redisUrl
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
   * @property {string} host
   * @property {number} port
   * @property {boolean} clusterMode
   * @property {number} startTimeoutMs
   * @property {Object} postgres
   * @property {string} redisUrl
   * @property {Object} sequelizeConnectionOptions
   * @property {string} facebookAppId
   * @property {string} facebookAppSecret
   * @property {string} googleAppId
   * @property {string} googleAppSecret
   * @property {string} twitterClientID
   * @property {string} twitterClientSecret
   * @property {string} authSecret
   * @property {number} authTokenExpirationTime
   * @returns {void} Nothing
   */
  constructor() {
    this.host = ''
    this.port = 0
    this.clusterMode = false
    this.startTimeoutMs = 0
    this.postgres = {}
    this.redisUrl = ''
    this.facebookAppId = ''
    this.facebookAppSecret = ''
    this.googleAppId = ''
    this.googleAppSecret = ''
    this.twitterClientID = ''
    this.twitterClientSecret = ''
    this.authSecret = ''
    this.authTokenExpirationTime = 0

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
        filePrefix = 'dev'
        logger.error('Incorrect NODE_ENV!')
      }
    }

    const filePath = path.join(__dirname, `config.${filePrefix}.json`)

    if (fs.existsSync(filePath)) {
      const configs = require(`./config.${filePrefix}.json`)
      this.host = configs.host
      this.port = configs.port
      this.clusterMode = configs.clusterMode
      this.startTimeoutMs = configs.startTimeoutMs
      this.postgres = configs.postgres
      this.redisUrl = configs.redisUrl
      this.facebookAppId = configs.facebookAppId
      this.facebookAppSecret = configs.facebookAppSecret
      this.googleAppId = configs.googleAppId
      this.googleAppSecret = configs.googleAppSecret
      this.twitterClientID = configs.twitterClientID
      this.twitterClientSecret = configs.twitterClientSecret
      this.authSecret = configs.authSecret
      this.authTokenExpirationTime = configs.authTokenExpirationTime
    } else {
      logger.error(`Not found: ${filePath}`)
    }
  }
}

module.exports = Config
