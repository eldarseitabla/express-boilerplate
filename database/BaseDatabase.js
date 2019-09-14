'use strict'

class BaseDatabase {
  async syncConnection() {
    this._logger.error('Need implement this method!')
  }
}
module.exports = BaseDatabase
