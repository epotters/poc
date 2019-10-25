#!/usr/bin/env bash


# Start only the database server using docker compose
cd environments/dev/
docker-compose up -d poc-db


# Start the Web API Spring Boot application using maven
cd poc-web-api/
mvn spring-boot:run

# Can be started using the IDE as well
# poc-web-api/src/main/java/poc/web/api/PocWebApi


# Build and start Dojo GUI using npm
cd poc-web-gui-dojo/poc-dojo/
dojo build --mode dev --watch --serve -p 9998
