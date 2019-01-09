#!/usr/bin/env bash


https://api.getbase.com/oauth2/authorize
      ?client_id=$CLIENT_ID
      &response_type=code
      &redirect_uri=$CLIENT_REDIRECT_URI
      &state=$STATE







# Following command should result in an unauthorized reponse (401)
curl -i -H "Accept: application/json" -X GET http://localhost:18002/poc/api

# Request a token
curl -X POST --user 'poc:secret' -d 'grant_type=password&username=epo&password=password' http://localhost:18002/poc/oauth/token
