package poc.web.api.it.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.server.LocalServerPort;

import lombok.Data;


/*
Configure the location of the remote application to test
 */
@Data
@ConfigurationProperties(prefix = "it.remote")
public class RemoteApplicationProperties {

  private final String host = "localhost";
  private final String protocoll = "http";
//  @LocalServerPort
  private int port;

  private boolean startedByTest = false;

//  @Value("${server.servlet.context-path}")
  protected String contextPath;

//  @Value("${spring.data.rest.base-path}")
  protected String restBasePath;

  // @Value("${management.endpoints.web.base-path}")
  protected String managementBasePath = "/actuator";

//  @Value("${spring.security.user.name}")
  protected String username;

//  @Value("${spring.security.user.password}")
  protected String password;

}
