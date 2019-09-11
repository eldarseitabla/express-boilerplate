const passport = require('passport')
const AbstractService = require('../AbstractService')
const AuthController = require('./AuthController')
const AuthModel = require('./AuthModel')
const SessionManager = require('./SessionManager')
const {
  facebookStrategy,
} = require('./authStrategies')


module.exports = class AuthService extends AbstractService {
  constructor(router, postgres, redis, config, User, logger) {
    super()

    passport.use(facebookStrategy(
      config, postgres.models.User,
    ))

    this._router = router
    this._sessionManager = new SessionManager(logger, redis, config)

    const authModel = new AuthModel()
    const authController = new AuthController(logger, authModel, this._sessionManager)

    this._router.post('/sign-up', authController.signUp.bind(authController))

    this._router.get('/facebook', passport.authenticate('facebook'))
    this._router.get('/facebook/callback', authController.facebookCallback.bind(authController))
  }

  getRouter() {
    return this._router
  }
}
