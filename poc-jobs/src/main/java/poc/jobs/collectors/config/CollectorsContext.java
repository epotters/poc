package poc.jobs.collectors.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import poc.jobs.collectors.AccountService;
import poc.jobs.collectors.AccountServiceImpl;


@Configuration
public class CollectorsContext {

  @Bean
  AccountService accountService() {
    return new AccountServiceImpl();
  }

}
