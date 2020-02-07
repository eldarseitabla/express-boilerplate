'use strict'

const { lstatSync, readdirSync } = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')

const connect = async(config) => {
  console.log('Start connection postgres')
  const models = {}
  const sequelize = new Sequelize(config.url, config.options)

  const dir = path.join(__dirname, '/')
  readdirSync(dir)
    .filter(source => lstatSync(path.join(dir, source)).isDirectory() &&
      !source.includes('__tests__') &&
      !source.includes('postgres.provider.js'))
    .forEach((modelDir) => {
      const model = sequelize.import(path.join(dir, modelDir, '/index.js'))
      models[model.name] = model
    })

  Object.keys(models).forEach((key) => {
    const model = models[key]

    if (model.associate) {
      model.associate(models)
    }
  })

  await sequelize.authenticate()

  return { sequelize, models }
}

module.exports = { connect }
