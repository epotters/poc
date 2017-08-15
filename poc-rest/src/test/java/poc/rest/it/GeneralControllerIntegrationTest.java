package poc.rest.it;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2AccessDeniedException;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.HttpClientErrorException;

import poc.core.domain.UserAccount;


@Profile("integration-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class GeneralControllerIntegrationTest extends BaseIntegrationTest {

  private Object HttpClientErrorException;


  // @Test
  public void healthCheck() throws URISyntaxException {
    health();
  }


  @Test
  public void currentUser() {
    final UserDetails currentUser = restTemplate.getForObject(getRestUri() + "/users/me", UserAccount.class);
    System.out.println(currentUser);
    Assert.assertEquals("Unexpected current user found", "epo", currentUser.getUsername());
  }


  @Test
  public void error401() throws URISyntaxException {
    URI uri = new URI(getRestUri() + "/persons");
    String username = "epo";
    String wrongPassword = "54321";
    try {
      OAuth2RestTemplate restTemplate = createOauth2Template(username, wrongPassword);
      restTemplate.getForEntity(uri, Map.class);
    }
    catch (OAuth2AccessDeniedException exception) {
      Assert.assertEquals("Unexpected error message", "Access token denied.", exception.getMessage());
    }
  }


  @Test
  public void error404() throws URISyntaxException {
    URI uri = new URI(getRestUri() + "/this-url-does-not-exist");
    System.out.println("Rest URI for 404 error: " + uri);
    ResponseEntity<Map> responseEntity = null;
    try {
      restTemplate.getForEntity(uri, Map.class);
    }
    catch (HttpClientErrorException httpClientErrorException) {
      Assert.assertEquals("Unexpected error code", HttpStatus.NOT_FOUND, httpClientErrorException.getStatusCode());
    }
  }
}
