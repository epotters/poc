package poc.web.api.it;


import java.net.URI;
import java.net.URISyntaxException;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.WebClient;
import poc.test.config.RemoteApplicationProperties;
import reactor.core.publisher.Mono;

//import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
//import org.springframework.security.oauth2.client.OAuth2RestTemplate;
//import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;

@Slf4j
@ActiveProfiles("test")
public class BaseIntegrationTest {


  @Value("${server.servlet.context-path}")
  protected String contextPath;

  @Value("${spring.data.rest.base-path}")
  protected String restBasePath;

  @Value("${management.endpoints.web.base-path}")
  protected String managementBasePath;

  @LocalServerPort
  private int port;

  private RemoteApplicationProperties remoteApplicationProperties;

  WebClient webClient;

  BaseIntegrationTest() {
    log.debug("Constructing BaseIntegrationTest (1)");
  }


  @Autowired
  BaseIntegrationTest(RemoteApplicationProperties remoteApplicationProperties) {
    log.debug("Constructing BaseIntegrationTest (2)");
    this.remoteApplicationProperties = remoteApplicationProperties;
  }


  private String getRootUri() {
    return remoteApplicationProperties.getProtocoll() + "://" + remoteApplicationProperties.getHost() + ":" + port
        + contextPath;
  }


  String getRestUri() {
    return getRootUri() + restBasePath;
  }


  String getAccessTokenUri() {
    return getRootUri() + "/oauth/token";
  }


  String getManagementUri() {
    return getRootUri() + managementBasePath;
  }


  @Before
  public void setUp() {
    log.debug("Setting up BaseIntegrationTest");

    printServerProperties();
//    restTemplate = createOauth2Template("epo", "12345");
  }


//  OAuth2RestTemplate createOauth2Template(String username, String password) {
//    String clientId = "poc";
//    String resourceId = "poc-api";
//
//    ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
//    // ClientCredentialsResourceDetails resourceDetails = new ClientCredentialsResourceDetails();
//    // AuthorizationCodeResourceDetails resourceDetails = new AuthorizationCodeResourceDetails();
//
//    resourceDetails.setGrantType("password");
//    resourceDetails.setAccessTokenUri(getAccessTokenUri());
//    resourceDetails.setId(resourceId);
//    resourceDetails.setClientId(clientId);
//    resourceDetails.setClientSecret("9876543210");
//    resourceDetails.setScope(asList("read", "write"));
//    resourceDetails.setUsername(username);
//    resourceDetails.setPassword(password);
//
//    LOG.debug("" + resourceDetails.getAuthenticationScheme());
//
//    DefaultOAuth2ClientContext clientContext = new DefaultOAuth2ClientContext();
//
//    restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);
//
//    restTemplate.setMessageConverters(Collections.singletonList(new MappingJackson2HttpMessageConverter()));
//
//    return restTemplate;
//  }


  void health() throws URISyntaxException {

    URI uri = new URI(getManagementUri() + "/health");
    log.debug("Management Health URI: " + uri);
    System.out.println("Management Health URI: " + uri);
    Assert.assertNotNull("No web client", webClient);
//
//    ResponseEntity<JSONObject> actuatorResponse = restTemplate.getForEntity(uri, JSONObject.class);
//    JSONObject actuatorEntity = actuatorResponse.getBody();


    Mono<String> body = this.webClient
        .get()
        .uri(uri).accept(MediaType.APPLICATION_JSON)
        .retrieve()
        .bodyToMono(String.class);


    String responseBody = body.block();

    System.out.println("Actuator health response: " + responseBody);

//    Assert.assertEquals("Call to health service did not return OK (HTTP 200)", actuatorResponse.getStatusCode(), HttpStatus.OK);
    Assert.assertEquals("Status does not equal UP", "UP", responseBody);
  }


  private void printServerProperties() {
    log.debug("Local server is listening on port " + port);
    log.debug("contextPath: " + contextPath + ", restBasePath: " + restBasePath);
    // LOG.debug("username: " + username + ", password: " + password);
  }


  void printResponse(ResponseEntity responseEntity) {
    log.debug(responseEntity.toString());
    log.debug("Response code: " + responseEntity.getStatusCode());
    log.debug("Response body: " + responseEntity.getBody());
  }

}
