#!/bin/bash

DockerComposeFile=$PWD/docker/docker-compose.yml

if [ "$1" == "start" ]
then
    docker-compose -f $DockerComposeFile down
    docker-compose -f $DockerComposeFile up -d


elif [ "$1" == "log" ]
then
    docker-compose -f $DockerComposeFile logs -t -f mongo
fi
