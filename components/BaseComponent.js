'use strict'

class BaseComponent {
  constructor(router) {
    if (!router) {
      throw new Error('No router')
    }
    this._router = router
  }

  getRouter() {
    return this._router
  }
}

module.exports = BaseComponent
