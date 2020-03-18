package poc.core.repository;


import java.time.LocalDate;
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
import poc.core.domain.Employment;
import poc.core.domain.Gender;
import poc.core.domain.Organization;
import poc.core.domain.Person;
import poc.core.repository.specification.SpecificationsBuilder;


@DataJpaTest
@ContextConfiguration(classes = CoreContext.class)
@RunWith(SpringRunner.class)
public class EmploymentRepositoryTest {

  private static final Log LOG = LogFactory.getLog(EmploymentRepositoryTest.class);

  @Autowired
  private PersonRepository personRepository;

  @Autowired
  private OrganizationRepository organizationRepository;

  @Autowired
  private EmploymentRepository employmentRepository;

  @Before
  public void prepareTests() {

    Assert.assertNotNull(personRepository);
    Assert.assertNotNull(organizationRepository);
    Assert.assertNotNull(employmentRepository);
    LOG.debug("@prepareTests");

    personRepository.deleteAll();
    organizationRepository.deleteAll();
    employmentRepository.deleteAll();

    loadData();
  }

  @Test
  public void findAll() {
    List<Employment> results = employmentRepository.findAll();
    listResults(results, "Search all employments");
    Assert.assertEquals("There should be 4 employments found", 4, results.size());
  }

  @Test
  public void findFilteredByExactStartDate() {

    SpecificationsBuilder<Employment> builder = new SpecificationsBuilder<>();
    Specification<Employment> specifications;

    LocalDate startDate = LocalDate.of(1992, 6, 22);
    builder.with("startDate", ":", startDate);
    specifications = builder.build();
    List<Employment> results = employmentRepository.findAll(specifications);
    listResults(results, "Search for employments starting on " + startDate.toString());
    Assert.assertEquals("There should be 1 employment found", 1, results.size());
    Assert.assertEquals("Found employment should have start date " + startDate.toString(), startDate, results.get(0).getStartDate());
  }

  @Test
  public void findFilteredByYear() {

    SpecificationsBuilder<Employment> builder = new SpecificationsBuilder<>();
    Specification<Employment> specifications;

    int year = 1993;

    LocalDate rangeStart = LocalDate.of(year, 1, 1).minusDays(1);
    LocalDate rangeEnd = LocalDate.of(year, 12, 31).plusDays(1);

    builder.with("startDate", ">", rangeStart);
    builder.with("startDate", "<", rangeEnd);
    specifications = builder.build();

    List<Employment> results = employmentRepository.findAll(specifications);
    listResults(results, "Search for employments starting in " + year);
    Assert.assertEquals("There should be 1 search result", 1, results.size());
  }

  @Test
  public void findFilteredByEmployeeBirthYear() {

    SpecificationsBuilder<Employment> builder = new SpecificationsBuilder<>();
    Specification<Employment> specifications;

    int year = 1970;
    LocalDate rangeStart = LocalDate.of(year, 1, 1).minusDays(1);
    LocalDate rangeEnd = LocalDate.of(year, 12, 31).plusDays(1);

    builder.with("employee.birthDate", ">", rangeStart);
    builder.with("employee.birthDate", "<", rangeEnd);
    specifications = builder.build();

    List<Employment> results = employmentRepository.findAll(specifications);
    listResults(results, "Employments of employees born in " + year);
    Assert.assertEquals("There should be 3 search result", 3, results.size());
  }


  private void loadData() {

    Person kim = personRepository.save(new Person("Kim", "Bauer", Gender.FEMALE, LocalDate.of(1985, 3, 5)));
    Person jack = personRepository.save(new Person("Jack", "Bauer", Gender.MALE, LocalDate.of(1970, 10, 5)));
    Person chloe = personRepository.save(new Person("Chloe", "O'Brian", Gender.FEMALE, LocalDate.of(1970, 7, 22)));

    Organization apple = organizationRepository.save(new Organization("Apple"));
    Organization google = organizationRepository.save(new Organization("Google"));

    employmentRepository.save(new Employment(kim, apple, LocalDate.of(1992, 6, 22), LocalDate.of(1994, 3, 23)));
    employmentRepository.save(new Employment(jack, google, LocalDate.of(1993, 12, 31), LocalDate.of(2006, 6, 13)));
    employmentRepository.save(new Employment(chloe, apple, LocalDate.of(1994, 5, 18), LocalDate.of(1999, 9, 3)));
    employmentRepository.save(new Employment(chloe, google, LocalDate.of(1999, 9, 4), null));

  }


  private void listResults(List<Employment> employments, String title) {
    if (title != null) {
      System.out.println(title);
    }
    for (Employment employment : employments) {
      System.out.println("   From " + employment.getStartDate() + " until " + ((employment.getEndDate() != null) ? employment.getEndDate() : "now") +
          " " + employment.getEmployee().getLastName() + " works at " + employment.getEmployer().getName());
    }
  }
}
