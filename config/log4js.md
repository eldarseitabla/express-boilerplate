# Log4js configures


## File and console

Source: [https://github.com/log4js-node/log4js-node/blob/master/examples/example.js](https://github.com/log4js-node/log4js-node/blob/master/examples/example.js)

```json
{
  "appenders": {
    "fatalError": { "type": "file", "filename": "../logs/fatal.log" },
    "fileError": { "type": "file", "filename": "../logs/error.log" },
    "console": { "type": "console" }
  },
  "categories": {
    "fatalError": { "appenders": ["fatalError"], "level": "fatal" },
    "fileError": { "appenders": ["fileError"], "level": "error" },
    "console": { "appenders": ["console"], "level": "trace" },
    "default": { "appenders": ["console", "fileError", "fatalError"], "level": "trace" }
  }
}
```

Use
```js
const logger = log4js.getLogger('cheese');
// only errors and above get logged.
const otherLogger = log4js.getLogger();

// this will get coloured output on console, and appear in cheese.log
otherLogger.error('AAArgh! Something went wrong', { some: 'otherObject', useful_for: 'debug purposes' });
otherLogger.log('This should appear as info output');

// these will not appear (logging level beneath error)
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.log('Something funny about cheese.');
logger.warn('Cheese is quite smelly.');
// these end up only in cheese.log
logger.error('Cheese %s is too ripe!', 'gouda');
logger.fatal('Cheese was breeding ground for listeria.');

// these don't end up in cheese.log, but will appear on the console
const anotherLogger = log4js.getLogger('another');
anotherLogger.debug('Just checking');

// will also go to console and cheese.log, since that's configured for all categories
const pantsLog = log4js.getLogger('pants');
pantsLog.debug('Something for pants');
```


## Log4JS - Logstash UDP appender

Source: [https://github.com/log4js-node/logstashUDP](https://github.com/log4js-node/logstashUDP)

```json
{
  "appenders": {
    "logstash": {
      "type": "@log4js-node/logstashudp",
      "host": "log.server",
      "port": 12345
    }
  },
  "categories": {
    "default": { "appenders": ["logstash"], "level": "info" }
  }
}
```

## Slack Appender for log4js-node

Source: [https://github.com/log4js-node/slack](https://github.com/log4js-node/slack)

```json
{
  "appenders": {
    "alerts": {
      "type": "@log4js-node/slack",
      "token": "abc123def",
      "channel_id": "prod-alerts",
      "username": "our_application"
    }
  },
  "categories": {
    "default": { "appenders": ["alerts"], "level": "error" }
  }
}
```
