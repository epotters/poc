

Docker images build in this project:

`epotters/poc-web-api`

Images are built using Google's jib-maven-plugin an pushed to Docker Hub



Start generated image:

`docker run epotters/poc-web-api:0.1-SNAPSHOT`


Start the database:

`docker run mysql/mysql-server:8.0.13`


Start the environment:

`cd environment`

`docker-compose up`


TODO

- Look for a smaller base image
- Remove the credentials from the pom, docker-compose and application-xxx.yml files.

