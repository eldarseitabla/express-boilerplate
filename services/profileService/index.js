const AbstractService = require('../AbstractService')
const ProfileController = require('./ProfileController')
const ProfileModel = require('./ProfileModel')

module.exports = class ProfileService extends AbstractService {
  constructor(router, logger) {
    super()
    this._router = router
    const profileModel = new ProfileModel()
    const profileController = new ProfileController(logger, profileModel)
    this._router.post('/', profileController.create.bind(profileController))
    this._router.get('/', profileController.getList.bind(profileController))
  }

  getRouter() {
    return this._router
  }
}
