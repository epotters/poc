package poc.rest;


import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoRestTemplateCustomizer;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.test.context.ContextConfiguration;
import poc.rest.config.oauth2a.CustomOAuth2RestTemplate;


@ContextConfiguration(classes = {poc.core.config.CoreContext.class, poc.rest.config.RestContext.class})
@SpringBootApplication
@EnableOAuth2Sso
public class Application extends SpringBootServletInitializer {

    private static Logger LOG = Logger.getLogger(Application.class);

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
