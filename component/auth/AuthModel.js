'use strict'

const crypto = require('crypto')

/**
 * @memberOf module:component/auth
 * @instance
 */
class AuthModel {
  constructor(db) {
    this._db = db
  }

  create() {
    return {
      test: '1455555',
    }
  }

  getList() {
    return {
      data: [
        { id: 1, name: 'Profile 1' },
        { id: 2, name: 'Profile 2' },
      ],
    }
  }

  static encodePassword(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
  }
}

module.exports = AuthModel
