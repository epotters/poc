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
import org.springframework.test.context.junit4.SpringRunner;

import poc.core.domain.Person;

import static java.lang.String.format;


@Profile("integration-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class GeneralControllerIntegrationTest extends BaseIntegrationTest {

  // @Test
  public void healthCheck() throws URISyntaxException {
    health();
  }

  @Test
  public void clientAccess() {

    final Person person = oauth2RestTemplate.getForObject(format("http://localhost:%d/poc/api/persons/1", port), Person.class);

    System.out.println(person);
  }

/*
  @Test
  public void error401() throws URISyntaxException {
    URI uri = new URI(getRestUri() + "/persons");
    System.out.println("Rest URI for 401 error: " + uri);
    ResponseEntity<Map> responseEntity =
        testRestTemplate.withBasicAuth(username, "this password is wrong").getForEntity(uri, Map.class);
    printResponse(responseEntity);
    Assert.assertEquals("Rest call with wrong password did not return a 401 error", HttpStatus.UNAUTHORIZED,
        responseEntity.getStatusCode());

  }
*/


  @Test
  public void error404() throws URISyntaxException {
    URI uri = new URI(getRestUri() + "/this-url-does-not-exist");
    System.out.println("Rest URI for 404 error: " + uri);
    ResponseEntity<Map> responseEntity = oauth2RestTemplate.getForEntity(uri, Map.class);
    printResponse(responseEntity);

    Assert.assertEquals("Rest call to non existent URL did not return 404 error", HttpStatus.NOT_FOUND,
        responseEntity.getStatusCode());
  }

}
