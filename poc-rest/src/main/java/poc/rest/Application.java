package poc.rest;


import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.cloud.security.oauth2.sso.EnableOAuth2Sso;
import org.springframework.test.context.ContextConfiguration;

import org.springframework.cloud.security.oauth2.resource.UserInfoRestTemplateCustomizer;
import poc.rest.config.CustomOAuth2RestTemplate;


@ContextConfiguration(classes = {poc.rest.config.RestContext.class})
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
