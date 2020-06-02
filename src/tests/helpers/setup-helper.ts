import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { config } from '../../config';

let mongoContainer: StartedTestContainer;

before(async (): Promise<void> => {
  const mongoDbName: string = 'eb_db_test';
  const mongoPort: number = 27017;
  try {
    mongoContainer = await new GenericContainer('mongo')
      .withName('mongo-test')
      .withExposedPorts(mongoPort)
      .withEnv('MONGO_INITDB_DATABASE', mongoDbName)
      .start();
    const host = mongoContainer.getContainerIpAddress();
    const port = mongoContainer.getMappedPort(mongoPort);
    config.mongo.url = `mongodb://${host}:${port}/${mongoDbName}`;
  } catch (e) {
    console.log(e);
  }
});

after(async (): Promise<void> => {
  if (mongoContainer) {
    await mongoContainer.stop();
  }
});
