'use strict'

const { Router } = require('express')

const { Base } = require('./base')

/**
 * @memberOf module:component
 * @instance
 */
class ModuleBase extends Base {
  constructor() {
    super()
    this._router = Router
  }

  set router(value) {
    if (value !== typeof Router) {
      throw new Error('Value should be instance of Router')
    }
    this._router = value
  }

  get router() {
    return this._router
  }
}

module.exports = { ModuleBase }
