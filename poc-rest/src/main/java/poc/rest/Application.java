package poc.rest;


import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.test.context.ContextConfiguration;



@ContextConfiguration(classes = {poc.rest.config.RestContext.class})
@SpringBootApplication
@EnableOAuth2Sso
// public class Application extends SpringBootServletInitializer {
public class Application extends WebSecurityConfigurerAdapter {



    private static Logger LOG = Logger.getLogger(Application.class);

    public static void main(String[] args) {
        LOG.info("Starting main application");
        SpringApplication.run(Application.class, args);
    }

}
