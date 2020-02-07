'use strict'

const passport = require('passport')
const { ModuleBase } = require('../../framework/module.base')
const { AuthController } = require('./auth.controller')
const { AuthModel } = require('./auth.model')
const { SessionManager } = require('./session-manager')
const {
  facebookStrategy,
} = require('./auth-strategies')

/**
 * @memberOf module:component/auth
 * @instance
 */
class AuthModule extends ModuleBase {
  constructor(postgres, redis, config) {
    super()
    this.database
  }

  async init(postgres, redis, config) {
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

module.exports = { AuthModule }
