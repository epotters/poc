package poc.web.api.it;


import static java.util.Arrays.asList;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;
import org.springframework.test.context.ActiveProfiles;

import net.minidev.json.JSONObject;
import poc.web.api.it.config.RemoteApplicationProperties;


@ActiveProfiles("test")
public class BaseIntegrationTest {

  static final Log LOG = LogFactory.getLog(BaseIntegrationTest.class);

  private final String HOST = "localhost";

  private final String PROTOCOLL = "http";

  @Value("${server.servlet.context-path}")
  protected String contextPath;

  @Value("${spring.data.rest.base-path}")
  protected String restBasePath;

  // @Value("${management.endpoints.web.base-path}")
  protected String managementBasePath = "/actuator";

  @Value("${spring.security.user.name}")
  protected String username;

  @Value("${spring.security.user.password}")
  protected String password;

  @LocalServerPort
  private int port;

  RemoteApplicationProperties remoteApplicationProperties;

  OAuth2RestTemplate restTemplate;


  BaseIntegrationTest() {
    LOG.debug("Constructing BaseIntegrationTest");
  }


  private String getRootUri() {
    return PROTOCOLL + "://" + HOST + ":" + port + contextPath;
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
    LOG.debug("Setting up BaseIntegrationTest");

    printServerProperties();
    restTemplate = createOauth2Template("epo", "12345");
  }


  OAuth2RestTemplate createOauth2Template(String username, String password) {
    String clientId = "poc";
    String resourceId = "poc-api";

    ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
    // ClientCredentialsResourceDetails resourceDetails = new ClientCredentialsResourceDetails();
    // AuthorizationCodeResourceDetails resourceDetails = new AuthorizationCodeResourceDetails();

    resourceDetails.setGrantType("password");
    resourceDetails.setAccessTokenUri(getAccessTokenUri());
    resourceDetails.setId(resourceId);
    resourceDetails.setClientId(clientId);
    resourceDetails.setClientSecret("9876543210");
    resourceDetails.setScope(asList("read", "write"));
    resourceDetails.setUsername(username);
    resourceDetails.setPassword(password);

    LOG.debug("" + resourceDetails.getAuthenticationScheme());

    DefaultOAuth2ClientContext clientContext = new DefaultOAuth2ClientContext();

    restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);

    restTemplate.setMessageConverters(Collections.singletonList(new MappingJackson2HttpMessageConverter()));

    return restTemplate;
  }


  void health() throws URISyntaxException {

    URI uri = new URI(getManagementUri() + "/health");
    LOG.debug("Management Health URI: " + uri);
    System.out.println("Management Health URI: " + uri);
    Assert.assertNotNull("No oauth2 rest template", restTemplate);

    ResponseEntity<JSONObject> actuatorResponse = restTemplate.getForEntity(uri, JSONObject.class);
    JSONObject actuatorEntity = actuatorResponse.getBody();

    System.out.println("Actuator health response: " + actuatorEntity.getAsString("status"));

    Assert.assertEquals("Call to health service did not return OK (HTTP 200)", actuatorResponse.getStatusCode(), HttpStatus.OK);
    Assert.assertEquals("Status does not equal UP", "UP", actuatorEntity.getAsString("status"));
  }


  private void printServerProperties() {
    LOG.debug("Local server is listening on port " + port);
    LOG.debug("contextPath: " + contextPath + ", restBasePath: " + restBasePath);
    // LOG.debug("username: " + username + ", password: " + password);
  }


  void printResponse(ResponseEntity responseEntity) {
    LOG.debug(responseEntity);
    LOG.debug("Response code: " + responseEntity.getStatusCode());
    LOG.debug("Response body: " + responseEntity.getBody());
  }

}
