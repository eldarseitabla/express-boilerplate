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
mkdir DockerVolumes

# Add environment path to directory for Volumes
export DOCKER_VOLUMES=~/DockerVolumes
# Check
echo $DOCKER_VOLUMES

docker-compose -f docker-compose-dev.yml up -d
```
