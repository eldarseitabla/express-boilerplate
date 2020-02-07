'use strict'

const cluster = require('cluster')
const os = require('os')
const pid = process.pid

const run = () => {
  if (cluster.isMaster) {
    const cpusCount = os.cpus().length
    console.log(`CPUs: ${cpusCount}`)
    console.log(`Master started. PID: ${pid}`)

    // Отнимаем одно ядро для мастер-процесса
    for (let i = 0; i < cpusCount - 1; i++) {
      cluster.fork()
      /**
       * worker.send('Hello from master!');
       * worker.on('message', (msg) => {
       *   console.log(`Message from worker ${worker.process.pid} : ${JSON.stringify(msg)}`);
       * });
       */
    }

    cluster.on('exit', (worker, code) => {
      console.log(`Worker died! pid: ${worker.process.pid}. Code ${code}`)
      // Если выходим с кодом 1 это значит произошла ошибка: перезапускаем вокрек
      if (code === 1) {
        cluster.fork()
      }
    })
  }

  if (cluster.isWorker) {
    const server = require('./server')
    server.run()
    /**
     * process.on('message', (msg) => {
     *   console.log(`Message from master: ${msg}`);
     * });
     * process.send({text: 'Hello from worker', pid});
     */
  }
}

module.exports = { run }
