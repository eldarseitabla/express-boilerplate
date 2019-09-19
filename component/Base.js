'use strict'
const logger = require('log4js').getLogger('[component.Base]')

/**
 * @memberOf module:component
 * @instance
 */
class Base {
  async _processing() {
    logger.error('Need implement abstract method')
  }

  /**
   * Decorator under _processing
   *
   * @param router
   * @return {Promise<*>}
   */
  getRouter(router) {
    if (!router) {
      logger.error('No router')
    }
    this._router = router
    this._processing.call(this, ...arguments)
    return this._router
  }
}

module.exports = Base
