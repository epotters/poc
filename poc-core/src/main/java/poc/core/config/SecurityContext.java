package poc.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import poc.core.service.SecurityService;
import poc.core.service.impl.SecurityServiceImpl;

/**
 * Created by epotters on 5-3-2015.
 */

@Configuration
public class SecurityContext {

  @Bean
  public SecurityService securityService() {
    return new SecurityServiceImpl();
  }


}
