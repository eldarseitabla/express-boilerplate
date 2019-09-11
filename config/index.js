'use strict'

const fs = require('fs')
const path = require('path')

const DEVELOPMENT = 'development'
const PRODUCTION = 'production'
const TEST = 'test'

const config = () => {
  let filePrefix
  switch (process.env.NODE_ENV) {
    case DEVELOPMENT: {
      filePrefix = 'dev'
      break
    }
    case PRODUCTION: {
      filePrefix = 'prod'
      break
    }
    case TEST: {
      filePrefix = 'test'
      break
    }
    default: {
      throw new Error('Incorrect NODE_ENV!')
    }
  }

  const filePath = path.join(__dirname, `config.${filePrefix}.json`)

  if (fs.existsSync(filePath)) {
    const configs = require(`./config.${filePrefix}.json`)
    return configs
  } else {
    throw new Error(`Not found: ${filePath}`)
  }
}

module.exports = config()
