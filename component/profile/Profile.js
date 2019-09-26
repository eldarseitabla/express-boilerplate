'use strict'

const Base = require('../Base')
const ProfileController = require('./ProfileController')
const ProfileModel = require('./ProfileModel')

/**
 * @memberOf module:component/profile
 * @instance
 */
class Profile extends Base {
  async _processing() {
    this._profileModel = new ProfileModel()
    this._profileController = new ProfileController(this._profileModel)
    this._router.post('/', this._profileController.create.bind(this._profileController))
    this._router.get('/', this._profileController.getList.bind(this._profileController))
  }
}

module.exports = Profile
