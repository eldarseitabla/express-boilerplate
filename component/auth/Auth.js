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

    this._sessionManager = new SessionManager(redis, config)
    this._authModel = new AuthModel()

    this._authController = new AuthController(this._authModel, this._sessionManager)

    this._router.post('/sign-up', this._authController.signUp.bind(this._authController))

    this._router.get('/facebook', passport.authenticate('facebook'))
    this._router.get('/facebook/callback', this._authController.facebookCallback.bind(this._authController))
  }
}

module.exports = Auth
