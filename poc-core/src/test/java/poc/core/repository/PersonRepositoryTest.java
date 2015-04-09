package poc.core.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ContextConfiguration;
import poc.core.Application;
import poc.core.model.Person;


/**
 * Created by eelko on 06-02-2015.
 */

@ContextConfiguration(locations = {"classpath:testContext.xml"})
@SpringApplicationConfiguration(classes = Application.class)
@EnableJpaRepositories(value="poc.core.repository")
@RunWith(MockitoJUnitRunner.class)
public class PersonRepositoryTest {


  @Autowired
  private PersonRepository personRepository;

  // @Test
  public void savePeople() throws Exception {

    // Save a couple of people
    personRepository.save(new Person("Jack", "Bauer"));
    personRepository.save(new Person("Chloe", "O'Brian"));
    personRepository.save(new Person("Kim", "Bauer"));
    personRepository.save(new Person("David", "Palmer"));
    personRepository.save(new Person("Michelle", "Dessler"));

    // Fetch all customers
    System.out.println("People found with findAll():");
    System.out.println("-------------------------------");
    for (Person person : personRepository.findAll()) {
      System.out.println(person);
    }
    System.out.println();

    // Fetch an individual customer by ID
    Person person = personRepository.findOne(1L);
    System.out.println("Person found with findOne(1L):");
    System.out.println("--------------------------------");
    System.out.println(person);
    System.out.println();

    // Fetch customers by last name
    System.out.println("Person found with findByLastName('Bauer'):");
    System.out.println("--------------------------------------------");
    for (Person bauer : personRepository.findByLastName("Bauer")) {
      System.out.println(bauer);
    }
  }

}
