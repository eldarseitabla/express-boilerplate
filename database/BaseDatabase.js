'use strict'

class BaseDatabase {
  async syncConnection() {
    throw new Error('Need implement this method!')
  }
}
module.exports = BaseDatabase
