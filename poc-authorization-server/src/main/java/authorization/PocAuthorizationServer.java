package authorization;


import authorization.config.AuthorizationServerConfig;
import authorization.config.ServerSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;


@SpringBootApplication
@Import({ AuthorizationServerConfig.class, ServerSecurityConfig.class })
public class PocAuthorizationServer {

  public static void main(String[] args) {
    SpringApplication.run(PocAuthorizationServer.class, args);
  }
}
