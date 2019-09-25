'use strict'

/** @module database */

const { postgres, redis } = require('./provider')

module.exports = {
  postgres,
  redis,
}
