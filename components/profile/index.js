'use strict'

const BaseComponent = require('../BaseComponent')
const ProfileController = require('./ProfileController')
const ProfileModel = require('./ProfileModel')

class Profile extends BaseComponent {
  async _processing(router, logger) {
    const profileModel = new ProfileModel()
    const profileController = new ProfileController(logger, profileModel)
    this._router.post('/', profileController.create.bind(profileController))
    this._router.get('/', profileController.getList.bind(profileController))
  }
}

module.exports = new Profile()