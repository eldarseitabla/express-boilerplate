export const config: IConfig = {
  protocol: process.env.PROTOCOL,
  host: process.env.HOST,
  port: +process.env.PORT,
  clusterMode: false,
  startTimeoutMs: 2000,
  redis: {
    url: process.env.REDIS_URL,
    options: {},
  },
  postgres: {
    url: process.env.POSTGRES_URL,
    options: {
      logging: false,
      dialect: 'postgres'
    }
  },
  mongo: {
    url: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      poolSize: 10
    }
  },
  logstash: {
    host: process.env.LOGSTASH_HOST,
    port: +process.env.LOGSTASH_PORT
  },
  sequelizeConnectionOptions: {},
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  googleAppId: process.env.GOOGLE_APP_ID,
  googleAppSecret: process.env.GOOGLE_APP_SECRET,
  twitterClientID: process.env.TWITTER_CLIENT_ID,
  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,
  authSecret: process.env.AUTH_SECRET,
  authTokenExpirationTime: +process.env.AUTH_TOKEN_EXPIRATION_TIME,
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: `http://${process.env.HOST}:${process.env.PORT}/openapi.yml`
      }
    }
  }
};

export interface IRedis {
  url: string;
  options: object;
}

export interface IPostgres {
  url: string;
  options: {
    logging: boolean;
    dialect: 'postgres';
  };
}

export interface IMongo {
  url: string;
  options: {
    useNewUrlParser: boolean;
    poolSize: number;
  };
}

export interface IConfig {
  protocol: string;
  host: string;
  port: number;
  clusterMode: boolean;
  startTimeoutMs: number;
  redis: IRedis;
  postgres: IPostgres;
  mongo: IMongo;
  logstash: {
    host: string;
    port: number;
  };
  sequelizeConnectionOptions: object;
  facebookAppId: string;
  facebookAppSecret: string;
  googleAppId: string;
  googleAppSecret: string;
  twitterClientID: string;
  twitterClientSecret: string;
  authSecret: string;
  authTokenExpirationTime: number;
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: string;
      };
    };
  };
}
