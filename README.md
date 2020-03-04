# boilerplate-backend
Boilerplate Backend

### Checklist
- [x] Project Structure modules, directories and files
- [x] Lint
- [x] Start application
- [x] Error Handling
- [x] Logging
- [x] Test unit
- [x] TypeScript
- [ ] Prometheus Grafana in App and in Docker Compose
- [ ] Config module
- [ ] Dependency Injection
- [ ] MongoDb
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
