'use strict'

/**
 * @memberOf module:database/provider
 * @instance
 */
class Base {
  async syncConnection() {
    this._logger.error('Need implement this method!')
  }
}
module.exports = Base
