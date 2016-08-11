package poc.rest;


import poc.rest.config.oauth2a.CustomOAuth2RestTemplate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoRestTemplateCustomizer;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.test.context.ContextConfiguration;


@ContextConfiguration(classes = {poc.core.config.CoreContext.class, poc.rest.config.RestContext.class})
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

  private static final Log LOG = LogFactory.getLog(Application.class);

  UserInfoRestTemplateCustomizer customOauth2Template = new CustomOAuth2RestTemplate();


  public static void main(String[] args) {
    LOG.info("Starting main application");
    SpringApplication.run(Application.class, args);
  }


  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }
}
