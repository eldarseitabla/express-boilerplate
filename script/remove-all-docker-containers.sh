#!/bin/sh

# Stop and remove all containers and networks

echo "Removing all containers..."

docker stop $(docker ps --format '{{.ID}}')
docker rm $(docker ps -aqf status=exited)

docker network stop $(docker network ls --format '{{.ID}}')
docker network rm $(docker network ls --format '{{.ID}}')

docker volume stop $(docker volume ls --format '{{.Name}}')
docker volume rm $(docker volume ls --format '{{.Name}}')

echo "Removing all containers and networks complete"
