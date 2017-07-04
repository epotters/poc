package poc.rest.it;


import java.net.URI;
import java.net.URISyntaxException;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import poc.core.domain.Organization;


@Profile("integration-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class OrganizationControllerIntegrationTest extends BaseIntegrationTest {

  private URI organizationsUri;


  @Before
  public void setUpItems() throws URISyntaxException {
    LOG.debug("Logger from base class");
    System.out.println("Setting up OrganizationControllerIntegrationTest");
    organizationsUri = new URI(getRestUri() + "/organization");
  }


  private URI getOrganizationUri(long organizationId) throws URISyntaxException {
    return new URI(getRestUri() + "/organization/" + organizationId);
  }


  @Test
  public void items() throws URISyntaxException {

    System.out.println("Rest URI (for organizations): " + organizationsUri);

    ResponseEntity<Organization> responseEntity = testRestTemplate.getForEntity(organizationsUri, Organization.class);
    printResponse(responseEntity);
    Assert.assertTrue("Call to the items REST service did not return OK (HTTP 200)",
        responseEntity.getStatusCode().is2xxSuccessful());
  }


  @Test
  public void organizationsCrud() throws URISyntaxException {

    // Create
    Organization organizationToSend = createOrganization("Solera Nederland BV");
    HttpEntity<Organization> itemRequest = new HttpEntity<>(organizationToSend);
    ResponseEntity<Organization> responseEntity = testRestTemplate.exchange(organizationsUri, HttpMethod.POST, itemRequest, Organization.class);
    Assert.assertEquals(responseEntity.getStatusCode(), HttpStatus.CREATED);
    Organization responseItem = responseEntity.getBody();
    Assert.assertEquals("The name of the organization sent does not match te name of the organization received", organizationToSend.getName(),
        responseItem.getName());

    Organization abz = createOrganization("ABZ Nederland BV");
    responseEntity = testRestTemplate.exchange(organizationsUri, HttpMethod.POST, new HttpEntity<>(abz), Organization.class);
    LOG.debug(responseEntity);

    // Read
    responseEntity = testRestTemplate.getForEntity(getOrganizationUri(1), Organization.class);
    System.out.println("Organization created " + responseEntity.getBody());

    // Update
    Organization updatedOrganization = responseEntity.getBody();

    // TO DO: Change the Organization
    HttpEntity<Organization> updatedItemRequest = new HttpEntity<>(updatedOrganization);
    testRestTemplate.exchange(getOrganizationUri(1), HttpMethod.PUT, updatedItemRequest, Void.class);
    responseEntity = testRestTemplate.getForEntity(getOrganizationUri(1), Organization.class);
    System.out.println("Updated updatedOrganization read " + responseEntity.getBody());

    // Delete
    testRestTemplate.delete(getOrganizationUri(1));
    responseEntity = testRestTemplate.getForEntity(getOrganizationUri(1), Organization.class);
    Assert.assertEquals("Item still exists, delete failed", responseEntity.getStatusCode(), HttpStatus.NOT_FOUND);
    System.out.println("Item deleted (" + responseEntity + ")");
  }


  private Organization createOrganization(String organizationName) {
    Organization newOrganization = new Organization();
    newOrganization.setName(organizationName);
    return newOrganization;
  }

}
