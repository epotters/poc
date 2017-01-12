package poc.rest.config;


import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ContextConfiguration;

import poc.rest.Application;


/**
 * Created by epotters on 4-1-2017.
 */
@Profile("war")
@Configuration
@EnableAutoConfiguration
@ContextConfiguration(classes = {poc.rest.config.RestContext.class})
public class WebInitializer extends SpringBootServletInitializer {
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }
}
