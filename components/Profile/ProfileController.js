class ProfileController {
  constructor(logger, profileModel) {
    this._logger = logger
    this._profileModel = profileModel
  }

  create(req, res) {
    const result = this._profileModel.create()
    return res.send({ result })
  }

  getList(req, res) {
    const result = this._profileModel.getList()
    return res.send({ result })
  }
}

module.exports = ProfileController
