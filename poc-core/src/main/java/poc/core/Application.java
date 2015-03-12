package poc.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import poc.core.model.Person;
import poc.core.repository.PersonRepository;

/**
 * Created by epotters on 12-3-2015.
 */
@SpringBootApplication
public class Application implements CommandLineRunner {

  @Autowired
  PersonRepository personRepository;

  public static void main(String[] args) {
    SpringApplication.run(Application.class);
  }

  @Override
  public void run(String... strings) throws Exception {

    // Save a couple of people
    personRepository.save(new Person("Jack", "Bauer"));
    personRepository.save(new Person("Chloe", "O'Brian"));
    personRepository.save(new Person("Kim", "Bauer"));
    personRepository.save(new Person("David", "Palmer"));
    personRepository.save(new Person("Michelle", "Dessler"));

    // Fetch all customers
    System.out.println("Customers found with findAll():");
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
