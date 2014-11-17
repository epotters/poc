package rest;


import epotters.poc.core.model.Person;
import rest.repository.PersonRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;


@Configuration
@EnableJpaRepositories
@Import(RepositoryRestMvcConfiguration.class)

@ComponentScan
@EnableAutoConfiguration
public class Application extends SpringBootServletInitializer {

  public static void main(String[] args) {

    ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

    PersonRepository repository = context.getBean(PersonRepository.class);

    // Do stuff

    Person person = new Person();
    person.setFirstName("Eelko");
    person.setLastName("Potters");

    repository.save(person);

    context.close();
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(applicationClass);
  }

  private static Class<Application> applicationClass = Application.class;

}
