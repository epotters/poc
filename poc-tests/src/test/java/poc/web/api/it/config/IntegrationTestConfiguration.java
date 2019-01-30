package poc.web.api.it.config;


import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.WebApplicationContext;


@Configuration
@EnableConfigurationProperties(RemoteApplicationProperties.class)
public class IntegrationTestConfiguration implements ApplicationListener<WebServerInitializedEvent> {

  private WebApplicationContext webApplicationContext;


  @Override
  public void onApplicationEvent(WebServerInitializedEvent webServerInitializedEvent) {

  }


  @Bean
  WebApplicationContext webApplicationContext() {
    return webApplicationContext;
  }
}
