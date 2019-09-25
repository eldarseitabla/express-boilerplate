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
    const profileModel = new ProfileModel()
    const profileController = new ProfileController(profileModel)
    this._router.post('/', profileController.create.bind(profileController))
    this._router.get('/', profileController.getList.bind(profileController))
  }
}

module.exports = Profile
