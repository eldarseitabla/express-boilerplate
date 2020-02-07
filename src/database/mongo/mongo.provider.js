'use strict'

const mongoose = require('mongoose')

const { User } = require('./user')

const connect = async(config) => {
  console.log('Start connection mongo')
  const mongo = await mongoose.connect(config.url, config.options)
  const models = { User }
  return { mongo, models }
}

module.exports = { connect }
