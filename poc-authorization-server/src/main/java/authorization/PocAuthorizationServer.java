package authorization;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
//@Import({ AuthorizationServerConfig.class, ServerSecurityConfig.class })
public class PocAuthorizationServer {

  public static void main(String[] args) {
    SpringApplication.run(PocAuthorizationServer.class, args);
  }
}
