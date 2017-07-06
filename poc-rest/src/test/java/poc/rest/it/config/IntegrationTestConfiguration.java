package poc.rest.it.config;


import org.springframework.boot.context.embedded.EmbeddedServletContainerInitializedEvent;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class IntegrationTestConfiguration implements ApplicationListener<EmbeddedServletContainerInitializedEvent> {

  private EmbeddedWebApplicationContext webApplicationContext;


  @Override
  public void onApplicationEvent(EmbeddedServletContainerInitializedEvent event) {
    webApplicationContext = event.getApplicationContext();
  }


  @Bean
  EmbeddedWebApplicationContext webApplicationContext() {
    return webApplicationContext;
  }
}
