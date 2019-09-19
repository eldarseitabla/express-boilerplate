'use strict'

/**
 * @memberOf module:component/profile
 * @instance
 */
class ProfileModel {
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
}

module.exports = ProfileModel
