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


  }

}
