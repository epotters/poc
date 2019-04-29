

Three environments: DEV, TST, PRD

Docker images built in this project:

`epotters/poc-web-api`

[Docker Hub](https://www.google.com)

Following commands assume the working directory is the environment {env} you want to run

`cd environments/{env}`


Images are built using Google's jib-maven-plugin an pushed to Docker Hub.
To build the docker images, the Maven profile docker must be active.

Start generated image:

`docker run epotters/poc-web-api:0.1-SNAPSHOT`

or via docker-compose (preferred)

`docker-compose up -d poc-web-api`


The web GUI runs on a nginx:alpine docker image. Built frontend code is mapped to the webserver root directory

`docker-compose up -d poc-web-gui`


Start the database:

`docker-compose up -d poc-db`


Start an environment {env}:

`docker-compose up -d`


TODO

- Look for a smaller base image
- Remove the credentials from the pom, docker-compose and application-xxx.yml files.
- Create dev, test and prd environments

