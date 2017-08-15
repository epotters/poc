package poc.rest;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.test.context.ContextConfiguration;


@ContextConfiguration(classes = { poc.core.config.CoreContext.class, poc.rest.config.RestContext.class,
    poc.rest.config.AuthorizationServerConfig.class, poc.rest.config.ResourceServerConfig.class })
@SpringBootApplication
public class Application {

  private static final Log LOG = LogFactory.getLog(Application.class);


  public static void main(String[] args) {
    LOG.info("Starting Proof of Concept application");
    SpringApplication.run(Application.class, args);
  }
}
