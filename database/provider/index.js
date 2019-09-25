'use strict'

/** @module database/provider */

const postgres = require('./postgres')
const redis = require('./redis')

module.exports = {
  postgres,
  redis,
}
