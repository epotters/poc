package poc.rest.it;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.web.client.TestRestTemplate;
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

  @Value("${server.contextPath}")
  protected String contextPath;
  @Value("${spring.data.rest.basePath}")
  protected String restBasePath;
  @Value("${management.contextPath}")
  protected String managementContextPath;

  @Value("${security.user.name}")
  protected String username;
  @Value("${security.user.password}")
  protected String password;

  // TestRestTemplate testRestTemplate;

  OAuth2RestTemplate oauth2RestTemplate;

  @LocalServerPort
  int port;


  BaseIntegrationTest() {
    LOG.debug("Constructing BaseIntegrationTest");
    // testRestTemplate = (new TestRestTemplate()).withBasicAuth(username, password);
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


  private String getManagementUri() {
    return getRootUri() + managementContextPath;
  }


  @Before
  public void setUp() {
    LOG.debug("Setting up BaseIntegrationTest");

    printServerProperties();

    // testRestTemplate = testRestTemplate.withBasicAuth(username, password);
    setOauth2Template();
  }

  private void setOauth2Template() {

    ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
    resourceDetails.setUsername("epo");
    resourceDetails.setPassword("12345");
    resourceDetails.setAccessTokenUri(getAccessTokenUri());
    resourceDetails.setClientId("poc");
    resourceDetails.setClientSecret("secret");
    resourceDetails.setGrantType("password");
    resourceDetails.setScope(asList("read", "write"));

    DefaultOAuth2ClientContext clientContext = new DefaultOAuth2ClientContext();

    oauth2RestTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);
    oauth2RestTemplate.setMessageConverters(Collections.singletonList(new MappingJackson2HttpMessageConverter()));
  }


  void health() throws URISyntaxException {

    URI uri = new URI(getManagementUri() + "/health");
    LOG.debug("Management Health URI: " + uri);

    // Assert.assertNotNull("No test rest template", testRestTemplate);
    Assert.assertNotNull("No oauth2 rest template", oauth2RestTemplate);

    ResponseEntity<String> entity = oauth2RestTemplate.getForEntity(uri, String.class);

    printResponse(entity);

    Assert.assertTrue("Call to health service did not return OK (HTTP 200)", entity.getStatusCode().equals(HttpStatus.OK));
    Assert.assertTrue(entity.getBody().contains("\"status\":\"UP\""));
    Assert.assertFalse(entity.getBody().contains("\"hello\":\"1\""));
  }


  private void printServerProperties() {
    LOG.debug("Local server is listening on port " + port);
    LOG.debug("contextPath: " + contextPath + ", restBasePath: " + restBasePath);
    LOG.debug("username: " + username + ", password: " + password);
  }


  void printResponse(ResponseEntity responseEntity) {
    LOG.debug(responseEntity);
    LOG.debug("Response code: " + responseEntity.getStatusCode());
    LOG.debug("Response body: " + responseEntity.getBody());
  }

}
