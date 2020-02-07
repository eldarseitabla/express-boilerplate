'use strict'

/**
 * @memberOf module:component/auth
 * @instance
 */
class AuthController {
  constructor(profileModel, sessionManager) {
    this._profileModel = profileModel
    this._sessionManager = sessionManager
  }

  signUp(req, res) {
    const result = this._profileModel.create()
    return res.send({ result })
  }

  facebookCallback(req, res) {
    console.log('Facebook callback REQ', req)
    return res.send({ faceboockCallback: '12345' })
  }

  getList(req, res) {
    const result = this._profileModel.getList()
    return res.send({ result })
  }
}

module.exports = { AuthController }