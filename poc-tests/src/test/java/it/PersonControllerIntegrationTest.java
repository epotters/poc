package it;


import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import poc.core.domain.Person;
import poc.web.api.Application;

import java.net.URI;
import java.net.URISyntaxException;


@Profile("integration-test")
@SpringBootTest(classes = Application.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class PersonControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void people() throws URISyntaxException {
    URI uri = new URI(getRestUri() + "/persons");
    System.out.println("Rest URI (for people): " + uri);
    ResponseEntity<Person> responseEntity = restTemplate.getForEntity(uri, Person.class);
    printResponse(responseEntity);
    Assert.assertTrue("Call to people REST service did not return OK (HTTP 200)",
        responseEntity.getStatusCode().is2xxSuccessful());
  }
}
