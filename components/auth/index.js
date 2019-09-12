'use strict'

const passport = require('passport')
const BaseComponent = require('../BaseComponent')
const AuthController = require('./AuthController')
const AuthModel = require('./AuthModel')
const SessionManager = require('./SessionManager')
const {
  facebookStrategy,
} = require('./authStrategies')

class Auth extends BaseComponent {
  async _processing(router, postgres, redis, config, logger) {
    passport.use(facebookStrategy(
      config, postgres.models.User,
    ))

    const sessionManager = new SessionManager(logger, redis, config)
    const authModel = new AuthModel()

    const authController = new AuthController(logger, authModel, sessionManager)

    this._router.post('/sign-up', authController.signUp.bind(authController))

    this._router.get('/facebook', passport.authenticate('facebook'))
    this._router.get('/facebook/callback', authController.facebookCallback.bind(authController))
  }
}

module.exports = new Auth()
