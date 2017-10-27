package poc.core.repository;


import java.time.LocalDate;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import poc.core.domain.Gender;
import poc.core.domain.Person;


/**
 * Created by eelko on 2015-02-06
 */

@SpringBootTest(classes = {poc.core.config.CoreContext.class})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class})
@RunWith(SpringRunner.class)
public class PersonRepositoryTest {

  private static final Log LOG = LogFactory.getLog(PersonRepositoryTest.class);

  @Autowired
  private PersonRepository personRepository;


  @Before
  public void prepareTests() {
    LOG.debug("@prepareTests");
  }


  @Test
  public void isRepositoryAvailable() {
    LOG.debug("@isRepositoryAvailable");
    Assert.assertNotNull(personRepository);
  }


  @Test
  public void savePeople() throws Exception {

    // Save a couple of people
    personRepository.save(new Person("Jack", "Bauer", Gender.MALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Chloe", "O'Brian", Gender.FEMALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Kim", "Bauer", Gender.FEMALE, LocalDate.of(1985, 3, 5)));
    personRepository.save(new Person("David", "Palmer", Gender.MALE, LocalDate.of(1970, 10, 5)));
    personRepository.save(new Person("Michelle", "Dessler", Gender.FEMALE, LocalDate.of(1960, 12, 30)));

    // Fetch all customers
    System.out.println("People found with findAll():");
    System.out.println("-------------------------------");
    for (Person person : personRepository.findAll()) {
      System.out.println(person);
    }
    System.out.println();

    /*
    // Fetch an individual customer by ID
    Person person = personRepository.getOne(1L);
    System.out.println("Person found with getOne(1L):");
    System.out.println("--------------------------------");
    System.out.println(person);
    System.out.println();
    */

    // Fetch customers by last name
    System.out.println("Person found with findByLastName('Bauer'):");
    System.out.println("--------------------------------------------");
    for (Person bauer : personRepository.findByLastName("Bauer")) {
      System.out.println(bauer);
    }
  }
}
