package poc.web.api.it.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;


/*
Configure the location of the remote application to test
 */
@Data
@ConfigurationProperties(prefix = "it.remote")
public class RemoteApplicationProperties {

  private final String host = "localhost";
  private final String protocoll = "http";
  private int port;

  private boolean startedByTest = false;

  protected String contextPath = "poc";
  protected String apiBasePath = "api";
  protected String managementBasePath = "/actuator";

}
