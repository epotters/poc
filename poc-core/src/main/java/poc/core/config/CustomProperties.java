package poc.core.config;


import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@ConfigurationProperties(prefix = "epo.application")
public class CustomProperties {

  private String name;
  private String displayName;
  private String version;

}
