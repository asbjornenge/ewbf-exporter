#!/bin/sh
VERSION=0.0.1
docker build -t registry.taghub:5000/sensorapp-endpoint:$VERSION .
