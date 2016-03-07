package poc.core;


import poc.core.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 * Created by epotters on 12-3-2015.
 */
@SpringBootApplication
public class Application implements CommandLineRunner {

  @Autowired
  PersonRepository personRepository;
  @Value("${name}")
  private String name;
  @Value("${displayName}")
  private String displayName;
  @Value("${version}")
  private String version;


  public static void main(String[] args) {
    SpringApplication.run(Application.class);
  }


  @Override
  public void run(String... strings) throws Exception {

  }

}
