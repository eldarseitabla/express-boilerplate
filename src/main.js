#!/usr/bin/env node

'use strict'

require('dotenv').config()

if (!process.env.LOG4JS_CONFIG) {
  process.env.LOG4JS_CONFIG = 'config/log4js.dev.json'
}

const config = require('../config/config.json')

if (config.clusterMode) {
  const cluster = require('./cluster')
  cluster.run()
} else {
  const server = require('./server')
  server.run('Server')
}
