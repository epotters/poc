package poc.web.api;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.test.context.ContextConfiguration;

import poc.web.api.config.AuthorizationServerConfig;
import poc.web.api.config.ResourceServerConfig;
import poc.web.api.config.RestContext;
import poc.web.api.config.ServerSecurityConfig;


@ContextConfiguration(classes = {poc.core.config.CoreContext.class, RestContext.class,
    ServerSecurityConfig.class, //
    AuthorizationServerConfig.class, ResourceServerConfig.class})
@SpringBootApplication
public class Application {

  private static final Log LOG = LogFactory.getLog(Application.class);


  public static void main(String[] args) {
    LOG.info("Starting Proof of Concept application");
    SpringApplication.run(Application.class, args);
  }
}
