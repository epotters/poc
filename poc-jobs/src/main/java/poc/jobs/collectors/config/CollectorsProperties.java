package poc.jobs.collectors.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@Setter
@ConfigurationProperties(prefix = "collectors")
public class CollectorsProperties {
  private String driverName;
  private boolean headless = false;
  private String outputPath;
  private String oscreenshotsPath;
}