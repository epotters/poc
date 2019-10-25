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
import poc.core.domain.Gender;
import poc.core.domain.Person;
import poc.core.repository.specification.SpecificationsBuilder;


@DataJpaTest
@ContextConfiguration(classes = CoreContext.class)
@RunWith(SpringRunner.class)
public class PersonRepositoryTest {

  private static final Log LOG = LogFactory.getLog(PersonRepositoryTest.class);

  @Autowired
  private PersonRepository personRepository;


  @Before
  public void prepareTests() {
    Assert.assertNotNull(personRepository);
    LOG.debug("@prepareTests");
    personRepository.deleteAll();
    loadPeople();
  }


  @Test
  public void savePeople() throws Exception {

    List<Person> peopleFound;

    // Fetch people by last name
    peopleFound = personRepository.findAll();
    listPeople(peopleFound, "People found with findAll()");
    Assert.assertEquals("There should be 5 search results", 5, peopleFound.size());


    // Fetch people by last name
    peopleFound = personRepository.findByLastName("Bauer");
    listPeople(peopleFound, "Person found with findByLastName('Bauer')");
    Assert.assertEquals("There should be 2 search results", 2, peopleFound.size());

  }


  @Test
  public void findPeopleFiltered() {

    SpecificationsBuilder<Person> builder = new SpecificationsBuilder<>();
    builder.with("firstName", "~", "Jac%");
    builder.with("lastName", "~", "Bau%");
    Specification<Person> specifications = builder.build();

    List<Person> peopleFound = personRepository.findAll(specifications);
    listPeople(peopleFound, "Search for people by partial first and last name");
    Assert.assertEquals("There should be 1 search result", 1, peopleFound.size());

  }


  private void loadPeople() {
    // Save a couple of people
    personRepository.save(new Person("Jack", "Bauer", Gender.MALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Chloe", "O'Brian", Gender.FEMALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Kim", "Bauer", Gender.FEMALE, LocalDate.of(1985, 3, 5)));
    personRepository.save(new Person("David", "Palmer", Gender.MALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Michelle", "Dessler", Gender.FEMALE, LocalDate.of(1960, 12, 30)));
  }


  private void listPeople(List<Person> people, String title) {
    if (title != null) {
      System.out.println(title);
    }
    for (Person person : people) {
      System.out.println("   " + person.getFirstName() + " " + person.getLastName());
    }
  }
}
