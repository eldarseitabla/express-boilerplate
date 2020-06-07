# express-boilerplate
Express Boilerplate

### Checklist
- [x] Project Structure modules, directories and files
- [x] Lint
- [x] Start application
- [x] Error Handling
- [x] Logging
- [x] TypeScript
- [x] Example Unit-test
- [x] Config
- [x] Dependency Injection
- [x] MongoDb
- [x] Authentication
- [ ] Example Product
- [ ] Authorization
- [ ] Logging to Logstash
- [ ] Memory Prometheus Grafana
    - [ ] current memory consumption;
    - [ ] current processor consumption;
    - [ ] tick frequency;
    - [ ] tick duration;
- [ ] Postgres
- [ ] Redis

## Development

### Getting started
- Install dependencies
```
cd <project_name>
npm i
```

- Set up env variables
```
cp ./.env.example ./.env
```

- Build and run the project
```
npm run build
npm start
```

- Development
```
npm start:dev
```

## Docker
### Run need services for development
```bash
# If not exists
mkdir ~/DockerVolumes

# Write env variable
echo 'export DOCKER_VOLUMES=$HOME/DockerVolumes' >> ~/.zshrc
# or
echo 'export DOCKER_VOLUMES=$HOME/DockerVolumes' >> ~/.bash_profile

# Check
echo $DOCKER_VOLUMES

# Build image
docker build -t eldarseytablaev/boilerplate .

# Run containers
docker-compose -f docker-compose-dev.yml up

# Stop end remove
docker-compose -f docker-compose-dev.yml down
```
