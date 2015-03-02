package poc.rest;


import poc.core.model.Person;
import poc.core.repository.PersonRepository;
import org.apache.log4j.Logger;
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
import org.springframework.web.servlet.config.annotation.EnableWebMvc;


@Configuration
@EnableAutoConfiguration
@ComponentScan("poc")

@EnableJpaRepositories
@Import(RepositoryRestMvcConfiguration.class)

@EnableWebMvc
public class Application extends SpringBootServletInitializer {

  private static Class<Application> applicationClass = Application.class;
  private static Logger LOG = Logger.getLogger(applicationClass);


  public static void main(String[] args) {

    LOG.info("Starting main application");

  }


  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(applicationClass);
  }

}
