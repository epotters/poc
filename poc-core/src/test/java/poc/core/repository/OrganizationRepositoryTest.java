package poc.core.repository;


import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import poc.core.config.CoreContext;
import poc.core.domain.Organization;
import poc.core.repository.specification.SpecificationsBuilder;


@DataJpaTest
@ContextConfiguration(classes = CoreContext.class)
@RunWith(SpringRunner.class)
public class OrganizationRepositoryTest {

  private static final Log LOG = LogFactory.getLog(OrganizationRepositoryTest.class);

  @Autowired
  private OrganizationRepository organizationRepository;


  @Before
  public void prepareTests() {
    Assert.assertNotNull(organizationRepository);
    LOG.debug("@prepareTests");
    organizationRepository.deleteAll();
    loadData();
  }


  @Test
  public void findAll() throws Exception {
    List<Organization> results = organizationRepository.findAll();
    listResults(results, "Organizations found with findAll()");
    Assert.assertEquals("There should be 2 search results", 2, results.size());
  }


  @Test
  public void findFiltered() {

    SpecificationsBuilder<Organization> builder = new SpecificationsBuilder<>();
    builder.with("name", "~", "App%");
    Specification<Organization> specifications = builder.build();

    List<Organization> results = organizationRepository.findAll(specifications);
    listResults(results, "Search for organizations by partial name");
    Assert.assertEquals("There should be 1 search result", 1, results.size());

  }


  private void loadData() {
    Organization apple = organizationRepository.save(new Organization("Apple"));
    Organization google = organizationRepository.save(new Organization("Google"));
  }


  private void listResults(List<Organization> organizations, String title) {
    if (title != null) {
      System.out.println(title);
    }
    for (Organization organization : organizations) {
      System.out.println("   " + organization.getName());
    }
  }
}
