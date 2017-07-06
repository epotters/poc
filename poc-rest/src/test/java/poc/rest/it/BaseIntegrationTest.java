package poc.rest.it;


import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;


/**
 * Created by eelko on 2016-04-08
 */
@TestPropertySource("/application-test.yml")
public class BaseIntegrationTest {

  static final Log LOG = LogFactory.getLog(BaseIntegrationTest.class);

  private final String HOST = "localhost";

  private final String PROTOCOLL = "http";
  @Value("${server.contextPath}")
  protected String contextPath;
  @Value("${spring.data.rest.base-path}")
  protected String restBasePath;
  @Value("${management.contextPath}")
  protected String managementContextPath;
  @Value("${security.user.name}")
  protected String username;
  @Value("${security.user.password}")
  protected String password;
  TestRestTemplate testRestTemplate;
  @LocalServerPort
  private int port;


  BaseIntegrationTest() {
    LOG.debug("Constructing BaseIntegrationTest");
    testRestTemplate = (new TestRestTemplate()).withBasicAuth(username, password);
  }


  String getRestUri() {
    return PROTOCOLL + "://" + HOST + ":" + port + contextPath + restBasePath;
  }


  private String getManagementUri() {
    return PROTOCOLL + "://" + HOST + ":" + port + contextPath + managementContextPath;
  }


  @Before
  public void setUp() {
    LOG.debug("Setting up BaseIntegrationTest");

    printServerProperties();

    testRestTemplate = testRestTemplate.withBasicAuth(username, password);
  }


  void health() throws URISyntaxException {

    URI uri = new URI(getManagementUri() + "/health");
    LOG.debug("Management Health URI: " + uri);

    Assert.assertNotNull("No test rest template", testRestTemplate);

    ResponseEntity<String> entity = testRestTemplate.getForEntity(uri, String.class);

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
