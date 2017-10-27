package poc.rest.it;


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
import org.springframework.test.context.TestPropertySource;

import static java.util.Arrays.asList;


/**
 * Created by eelko on 2016-04-08
 */
@TestPropertySource("/application-test.yml")
public class BaseIntegrationTest {

  static final Log LOG = LogFactory.getLog(BaseIntegrationTest.class);

  private static final String HOST = "localhost";
  private static final String PROTOCOLL = "http";

  @Value("${server.servlet.contextPath}")
  protected String contextPath;

  @Value("${spring.data.rest.basePath}")
  protected String restBasePath;

  // @Value("${management.context-path}")
  protected String managementContextPath = "application";

  OAuth2RestTemplate restTemplate;

  @LocalServerPort
  int port;


  BaseIntegrationTest() {
    LOG.debug("Constructing BaseIntegrationTest");
  }


  String getRootUri() {
    return PROTOCOLL + "://" + HOST + ":" + port + contextPath;
  }


  String getRestUri() {
    return getRootUri() + restBasePath;
  }


  String getAccessTokenUri() {
    return getRootUri() + "/oauth/token";
  }


  String getManagementUri() {
    return getRootUri() + managementContextPath;
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

    DefaultOAuth2ClientContext clientContext = new DefaultOAuth2ClientContext();

    restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);

    restTemplate.setMessageConverters(Collections.singletonList(new MappingJackson2HttpMessageConverter()));

    return restTemplate;
  }


  void health() throws URISyntaxException {

    URI uri = new URI(getManagementUri() + "/health");
    LOG.debug("Management Health URI: " + uri);

    Assert.assertNotNull("No oauth2 rest template", restTemplate);

    ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class);

    printResponse(entity);

    Assert.assertTrue("Call to health service did not return OK (HTTP 200)", entity.getStatusCode().equals(HttpStatus.OK));
    Assert.assertTrue(entity.getBody().contains("\"status\":\"UP\""));
    Assert.assertFalse(entity.getBody().contains("\"hello\":\"1\""));
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
