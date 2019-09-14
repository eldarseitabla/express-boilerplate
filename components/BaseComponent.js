'use strict'

class BaseComponent {
  async _processing() {
    this._logger.error('Need implement abstract method')
  }

  async getRouter(router) {
    if (!router) {
      this._logger.error('No router')
    }
    this._router = router
    await this._processing(arguments)
    return this._router
  }
}

module.exports = BaseComponent
