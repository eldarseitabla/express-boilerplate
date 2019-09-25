'use strict'

const passport = require('passport')
const Base = require('../Base')
const AuthController = require('./AuthController')
const AuthModel = require('./AuthModel')
const SessionManager = require('./SessionManager')
const {
  facebookStrategy,
} = require('./authStrategies')

/**
 * @memberOf module:component/auth
 * @instance
 */
class Auth extends Base {
  async _processing(router, postgres, redis, config) {
    passport.use(facebookStrategy(
      config, postgres.models.User,
    ))

    const sessionManager = new SessionManager(redis, config)
    const authModel = new AuthModel()

    const authController = new AuthController(authModel, sessionManager)

    this._router.post('/sign-up', authController.signUp.bind(authController))

    this._router.get('/facebook', passport.authenticate('facebook'))
    this._router.get('/facebook/callback', authController.facebookCallback.bind(authController))
  }
}

module.exports = Auth
