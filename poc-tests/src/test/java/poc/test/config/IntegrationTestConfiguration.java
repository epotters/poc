package poc.test.config;


import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;


@Configuration
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(basePackages = {"poc.test"})
@EnableConfigurationProperties(RemoteApplicationProperties.class)
public class IntegrationTestConfiguration {

  // Browser
  // Driver
  // Environment
  // Proxy
  // Tags

}
