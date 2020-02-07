'use strict'

const express = require('express')
const app = express()

const database = require('./database')
// const auth = require('./auth')
const users = require('./users')

// app.use('/auth', auth.getRouter(router, this.postgres, this.redis, config))
app.use('/profiles', users.router)

const getApp = async() => {
  await database.init()
  return app
}

module.exports = { getApp }
