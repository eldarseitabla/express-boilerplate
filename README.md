# boilerplate-backend
Boilerplate Backend

### Checklist
- [x] Project Structure components, directories and files
- [ ] Start application
- [ ] Error Handling
- [ ] Logging

## Dev

## Run need services for development
```bash
# If not exists
mkdir DockerVolumes

# Add environment path to directory for Volumes
export DOCKER_VOLUMES=~/DockerVolumes
# Check
echo $DOCKER_VOLUMES

docker-compose -f docker-compose-dev.yml up -d
```

## Remove all docker containers
```bash
bash script/remove-all-docker-containers.sh
```
