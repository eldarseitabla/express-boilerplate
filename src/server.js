'use strict'

const logger = require('log4js').getLogger('[app]')

const { getApp } = require('./app')

const { HOST, PORT } = process.env
const pid = process.pid

let httpServer

const run = async(name = 'Server') => {
  const app = await getApp()

  httpServer = app.listen(PORT, HOST, (error) => {
    if (!error) {
      logger.info(`${name} success running on the host: ${HOST} | port: ${PORT}| PID: ${pid}`)
    } else {
      logger.error({ message: `${name} error start server`, error })
      setTimeout(() => run(), 1000)
    }
  })

  /**
   * Ctr+C
   * воркер не будет перезапущен
   */
  process.on('SIGINT', () => {
    console.log('Signal is SIGINT')
    httpServer.close(() => {
      process.exit(0)
    })
  })

  /**
   * $ kill [pid]
   * воркер не будет перезапущен
   */
  process.on('SIGTERM', () => {
    console.log('Signal is SIGTERM')
    httpServer.close(() => {
      process.exit(0)
    })
  })

  /**
   * Пользовательский сигнал SIGUSR2
   * $ kill -s SIGUSR2 [pid]
   * проверяем что воркер перезапуститься при смерти с ошибкой
   */
  process.on('SIGUSR2', () => {
    console.log('Signal is SIGUSR2')
    httpServer.close(() => {
      process.exit(1)
    })
  })
}

/**
 * Если вызывается как модуль:
 *   экспортируем как модуль;
 * Если вызывается как приложение:
 *   запускаем как приложение;
 */
if (module.parent) {
  module.exports = { run }
} else {
  run()
}
