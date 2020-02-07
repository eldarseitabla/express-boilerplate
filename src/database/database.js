'use strict'

const { Base } = require('../../framework/base')
const { databaseProviders } = require('./database.providers')
const { nameProviders } = require('./name.providers')

class Database extends Base {
  constructor() {
    super()
    this._redis = null
    this._mongo = null
    this._postgres = null
  }

  async init() {
    const databases = await Promise.all(databaseProviders.map(provider => provider.getConnection()))
    this.redis = databases.find(db => db.provide === nameProviders.REDIS).connection
    this.mongo = databases.find(db => db.provide === nameProviders.MONGODB).connection
    this.postgres = databases.find(db => db.provide === nameProviders.POSTGRES).connection
  }

  set redis(value) {
    this._redis = value
  }
  get redis() {
    return this._redis
  }

  set mongo(value) {
    this._mongo = value
  }
  get mongo() {
    return this._mongo
  }

  set postgres(value) {
    this._postgres = value
  }
  get postgres() {
    return this._postgres
  }
}

module.exports = { Database }
