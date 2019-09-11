const { promisify } = require('util')
const _ = require('lodash')
const RedisSessions = require('redis-sessions')

const appName = 'boilerplateapp'

module.exports = class SessionManagerService {
  constructor(logger, redis, config) {
    this._logger = logger
    this._config = config
    this._redisSessions = new RedisSessions({
      // host: '127.0.0.1', // The Redis host.
      // port: 6379, // The Redis port.
      options: {}, // *optional* Default: {}. Additional options. See: https://github.com/mranney/node_redis#rediscreateclientport-host-options
      namespace: 'sess', // *optional* Default: "rs". The namespace prefix for all Redis keys used by this module.
      wipe: this._config.authTokenExpirationTime, // *optional* Default: 600. The interval in seconds after which expired sessions are wiped. Only values 0 or greater than 10 allowed. Set to 0 to disable.
      client: redis, // *optional* An external RedisClient object which will be used for the connection.
    })

    this._redisCreateAsync = promisify(this._redisSessions.create).bind(this._redis)
    this._redisGetAsync = promisify(this._redisSessions.get).bind(this._redis)
    this._redisKillAsync = promisify(this._redisSessions.kill).bind(this._redis)
  }

  getToken({ req }) {
    try {
      const authHeader = req.headers.authorization
      return authHeader.split(' ')[1]
    } catch (error) {
      this._logger.error({ message: `ERROR_GET_TOKEN: Error(${error.message})` })
      return null
    }
  }

  async create({ id, ip, user }) {
    try {
      return await this._redisCreateAsync({
        app: appName,
        id,
        ip,
        ttl: this._config.authTokenExpirationTime,
        d: {
          userId: user.userId,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      this._logger.error({ message: `ERROR_CREATE_SESSION: Error(${error.message})` })
      return null
    }
  }

  /**
     * @param {String} token
     */
  async getSession({ token, app = appName }) {
    try {
      const result = await this._redisGetAsync({ app, token })
      if (!result || _.isEmpty(result)) {
        return null
      }
      return result
    } catch (error) {
      this._logger.error({ message: `ERROR_GET_SESSION: Error(${error.message})` })
      return null
    }
  }

  async kill({ token, app = appName }) {
    try {
      const result = await this._redisKillAsync({ token, app })
      return result.kill
    } catch (error) {
      this._logger.error({ message: `ERROR_KILL_SESSION: Error(${error.message})` })
      return null
    }
  }
}
