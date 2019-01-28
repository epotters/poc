package it;


import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.HttpClientErrorException;
import poc.core.domain.Organization;
import poc.web.api.Application;

import java.net.URI;
import java.net.URISyntaxException;


@Profile("integration-test")
@SpringBootTest(classes = Application.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class OrganizationControllerIntegrationTest extends BaseIntegrationTest {

  private URI organizationsUri;


  @Before
  public void setUpItems() throws URISyntaxException {
    LOG.debug("Logger from base class");
    System.out.println("Setting up OrganizationControllerIntegrationTest");
    organizationsUri = new URI(getRestUri() + "/organizations");
  }


  private URI getOrganizationUri(long organizationId) throws URISyntaxException {
    return new URI(getRestUri() + "/organizations/" + organizationId);
  }


  @Test
  public void organizations() throws URISyntaxException {

    System.out.println("Rest URI (for organizations): " + organizationsUri);

    ResponseEntity<Organization> responseEntity = restTemplate.getForEntity(organizationsUri, Organization.class);
    printResponse(responseEntity);
    Assert.assertTrue("Call to the organizations REST service did not return OK (HTTP 200)",
        responseEntity.getStatusCode().is2xxSuccessful());
  }


  @Ignore
  @Test
  public void organizationsCrud() throws URISyntaxException {

    // Create
    Organization organizationToCreate = createOrganization("Solera Nederland BV");
    HttpEntity<Organization> itemRequest = new HttpEntity<>(organizationToCreate);
    ResponseEntity<Organization> responseEntity =
        restTemplate.exchange(organizationsUri, HttpMethod.POST, itemRequest, Organization.class);
    Assert.assertEquals(responseEntity.getStatusCode(), HttpStatus.CREATED);

    Organization responseItem = responseEntity.getBody();
    Assert.assertEquals("The name of the organization sent does not match te name of the organization received",
        organizationToCreate.getName(), responseItem.getName());

    Organization abz = createOrganization("ABZ Nederland BV");
    responseEntity = restTemplate.exchange(organizationsUri, HttpMethod.POST, new HttpEntity<>(abz), Organization.class);
    LOG.debug(responseEntity);

    // Read
    responseEntity = restTemplate.getForEntity(getOrganizationUri(1), Organization.class);
    System.out.println("Organization created " + responseEntity.getBody());

    // Update
    Organization updatedOrganization = responseEntity.getBody();
    updatedOrganization.setName("Philips");
    HttpEntity<Organization> updatedItemRequest = new HttpEntity<>(updatedOrganization);
    restTemplate.exchange(getOrganizationUri(1), HttpMethod.PUT, updatedItemRequest, Void.class);
    responseEntity = restTemplate.getForEntity(getOrganizationUri(1), Organization.class);
    System.out.println("Updated updatedOrganization read " + responseEntity.getBody());

    // Delete
    restTemplate.delete(getOrganizationUri(1));
    responseEntity = null;
    try {
      responseEntity = restTemplate.getForEntity(getOrganizationUri(1), Organization.class);

      Assert.assertEquals("Organization still exists, delete failed", HttpStatus.NOT_FOUND, responseEntity.getStatusCode());

    }
    catch (HttpClientErrorException e) {

      System.out.println("Organization deleted (" + responseEntity + ") " + e.getMessage());
    }
  }


  private Organization createOrganization(String organizationName) {
    Organization newOrganization = new Organization();
    newOrganization.setName(organizationName);
    return newOrganization;
  }

}
