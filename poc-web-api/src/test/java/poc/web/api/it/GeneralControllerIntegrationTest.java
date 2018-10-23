package poc.web.api.it;


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
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.HttpClientErrorException;

import poc.core.domain.UserAccount;


@Profile("integration-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class GeneralControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void contextLoads() {
    System.out.println("\n\n-----> Context loaded <-----\n\n");
  }


  @Test
  public void healthCheck() throws URISyntaxException {
    health();
  }


  @Test
  public void obtainToken() {

    final OAuth2AccessToken accessToken = restTemplate.getAccessToken();

    final String indent = "   ";
    System.out.println("Access token:");
    System.out.println(indent + "value: " + accessToken.getValue());
    System.out.println(indent + "scope: " + accessToken.getScope());
    System.out.println(indent + "type: " + accessToken.getTokenType());
    System.out.println(indent + "additional information: " + accessToken.getAdditionalInformation());

    Assert.assertEquals("epotters@xs4all.nl", accessToken.getAdditionalInformation().get("mail"));
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
    final String username = "epo";
    final String wrongPassword = "54321";
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
    final URI uri = new URI(getRestUri() + "/this-url-does-not-exist");
    System.out.println("Rest URI for 404 error: " + uri);
    try {
      restTemplate.getForEntity(uri, Map.class);
    }
    catch (HttpClientErrorException httpClientErrorException) {
      Assert.assertEquals("Unexpected error code", HttpStatus.NOT_FOUND, httpClientErrorException.getStatusCode());
    }
  }
}