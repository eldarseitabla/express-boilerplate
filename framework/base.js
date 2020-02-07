'use strict'
const logger = require('log4js').getLogger('[component.Base]')

/**
 * @memberOf module:component
 * @instance
 */
class Base {
  async init() {
    logger.error('Need implement abstract method')
  }
}

module.exports = { Base }
