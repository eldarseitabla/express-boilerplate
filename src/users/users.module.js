'use strict'

const { ModuleBase } = require('../../framework/module.base')
const { UsersController } = require('./users.controller')
const { UsersService } = require('./users.service')

/**
 * @memberOf module:component/profile
 * @instance
 */
class UsersModule extends ModuleBase {
  async init() {
    this._usersService = new UsersService()
    this._usersController = new UsersController(this._usersService)
    this._router.post('/', this._usersController.create.bind(this._usersController))
    this._router.get('/', this._usersController.getList.bind(this._usersController))
  }
}

module.exports = { UsersModule }
