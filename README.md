# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

This repo contains a collection of proofs of concept in Spring Boot and Angular. 
Basically it is an application to store People, Organizations and Employments.

- Spring Boot REST API
- Docker image for this API using JIB
- Angular Frontend
- Docker Image for the frontend built using maven-frontend-plugin and my own jib-maven-plugin
- Security OIDC using Keycloak, Spring Security and oidc-client.js

- modules poc-jobs for scheduled jobs and poc-test for integration tests are work in progress
- poc-web-gui-dojo is is effectively replaced by poc-web-gui-angular
- poc-evernote will probably be discontinued

It is not meant to be used as is but to try out new techniques in a sensible, real world like way.
The application is not necessarily all in working order.


### API ###


Web API
`/poc/api`

Web GUI
`/poc/`


Actuator endpoints
`/poc/actuator/`
