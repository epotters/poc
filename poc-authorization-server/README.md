# README #

A basic oauth server implemented with Spring Security.
For development purposes only.

### API ###

Authentication server
`/poc/oauth/`



Test with curl
`curl -v poc:9876543210@localhost:8003/oauth/token -d grant_type=password -d username=epo -d password=12345`
