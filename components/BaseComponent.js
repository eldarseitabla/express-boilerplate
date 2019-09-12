'use strict'

class BaseComponent {
  async _processing() {
    throw new Error('Need implement abstract method')
  }

  async getRouter(router) {
    if (!router) {
      throw new Error('No router')
    }
    this._router = router
    await this._processing(arguments)
    return this._router
  }
}

module.exports = BaseComponent
