

##### Obtain a token

# Example
# Source: https://medium.com/@dassum/securing-spring-boot-rest-api-with-json-web-token-and-jdbc-token-store-67558a7d6c29
curl -X POST http://testjwtclientid:XY7kmzoNzl100@localhost/oauth/token -H 'Authorization: Basic dGVzdGp3dGNsaWVudGlkOlhZN2ttem9OemwxMDA=' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=admin.admin&password=jwtpass&undefined='


# Generate Basic auth header online: https://www.blitter.se/utils/basic-authentication-header-generator/
# Authorization: Basic cG9jOjk4NzY1NDMyMTA=

# ClientId and client secret and Authorization header: works
curl -X POST http://poc:9876543210@localhost:8002/poc/oauth/token -H 'Authorization: Basic cG9jOjk4NzY1NDMyMTA=' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345&undefined='


# Only clientId and client secret:  works
curl -X POST http://localhost:8002/poc/oauth/token -H 'Authorization: Basic cG9jOjk4NzY1NDMyMTA=' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345&undefined='


# Only Authorization header: works
curl -X POST http://poc:9876543210@localhost:8002/poc/oauth/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345'


# Undefined is not needed ;-)
curl -X POST http://poc:9876543210@localhost:8002/poc/oauth/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345'


curl -X POST http://poc:9876543210@localhost:8002/poc/oauth/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345'



# Content type application/json: does NOT work
curl -X POST http://poc:9876543210@localhost:8002/poc/oauth/token -H 'Content-Type: application/json' -d 'grant_type=password&username=epo&password=12345'



curl -X POST http://localhost:8002/poc/oauth/token -H 'Authorization: Basic cG9jOjk4NzY1NDMyMTA=' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=password&username=epo&password=12345'


# Token returned

{
"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicG9jLWFwaSJdLCJtYWlsIjoiZXBvdHRlcnNAeHM0YWxsLm5sIiwidXNlcl9uYW1lIjoiZXBvIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImV4cCI6MTU1NjgxNDM4MywiYXV0aG9yaXRpZXMiOlsiVVNFUiIsIkFDVFVBVE9SIiwiQURNSU4iXSwianRpIjoiZWJiZTU0YjUtNTg0OS00Mjk1LWI5OWEtOTIwZTdjZDI0NTIwIiwiY2xpZW50X2lkIjoicG9jIn0.LeSjNtgootZjenSJbHwm-F_2T5YQJ23shdC6njhOc1k",
"token_type":"bearer",
"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicG9jLWFwaSJdLCJtYWlsIjoiZXBvdHRlcnNAeHM0YWxsLm5sIiwidXNlcl9uYW1lIjoiZXBvIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImF0aSI6ImViYmU1NGI1LTU4NDktNDI5NS1iOTlhLTkyMGU3Y2QyNDUyMCIsImV4cCI6MTU1Njg0Njc4MywiYXV0aG9yaXRpZXMiOlsiVVNFUiIsIkFDVFVBVE9SIiwiQURNSU4iXSwianRpIjoiYWNiMjViMmItYjAwOS00YThjLWFkNTQtNDRiY2RhNjRkNzc0IiwiY2xpZW50X2lkIjoicG9jIn0.iY4E2uOFQVlFiV6em_0VwYi5IahW-OIjJYf59Ml4GDU",
"expires_in":3599,
"scope":"read write",
"mail":"epotters@xs4all.nl",
"jti":"ebbe54b5-5849-4295-b99a-920e7cd24520"
}





##### Access resources using the token

Example:
curl -X GET \
  http://localhost:8080/jwttest/cities \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDQyOTM5MjksInVzZXJfbmFtZSI6ImFkbWluLmFkbWluIiwiYXV0aG9yaXRpZXMiOlsiU1RBTkRBUkRfVVNFUiIsIkFETUlOX1VTRVIiXSwianRpIjoiNjFkZWEzZjAtODYxZi00Nzc1LWEyMTMtMDQ1ZWVmN2EyODQ1IiwiY2xpZW50X2lkIjoidGVzdGp3dGNsaWVudGlkIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl19.DUW7PLTuF7Kk0y16I-srjaeJUE_wTSfvLr4Sb_5X3hc'



curl -X GET http://localhost:8002/poc/api/users/me  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicG9jLWFwaSJdLCJtYWlsIjoiZXBvdHRlcnNAeHM0YWxsLm5sIiwidXNlcl9uYW1lIjoiZXBvIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImV4cCI6MTU1NzA1NDA0NCwiYXV0aG9yaXRpZXMiOlsiVVNFUiIsIkFDVFVBVE9SIiwiQURNSU4iXSwianRpIjoiMDUwOGU1ZGUtZGJjZi00YzRlLTgwNDItZTQ3MzIxNzUwMzBmIiwiY2xpZW50X2lkIjoicG9jIn0.6LSh21ubJD-Co9jEiXNqzIeb6R_t2E5ESSpWqeHU95A","token_type":"bearer","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicG9jLWFwaSJdLCJtYWlsIjoiZXBvdHRlcnNAeHM0YWxsLm5sIiwidXNlcl9uYW1lIjoiZXBvIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImF0aSI6IjA1MDhlNWRlLWRiY2YtNGM0ZS04MDQyLWU0NzMyMTc1MDMwZiIsImV4cCI6MTU1NzA4NjQ0NCwiYXV0aG9yaXRpZXMiOlsiVVNFUiIsIkFDVFVBVE9SIiwiQURNSU4iXSwianRpIjoiYjc2NjM2MzItYWFkZi00MmQzLTkyYjctZjM3MGRmM2FiZmM1IiwiY2xpZW50X2lkIjoicG9jIn0.ptAFNM_oBi5cUOer-Sye6yUnG9zZZ2YBK53iAdN5uqU'


