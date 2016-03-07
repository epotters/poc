package poc.core.config;


import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


/**
 * Created by epotters on 17-08-2015
 */

@Configuration
@EnableAutoConfiguration
@EntityScan(basePackages = { "poc.core.domain" })
@EnableJpaRepositories(basePackages = { "poc.core.repository" })
@ComponentScan(basePackages = { "poc.core.service" })
@EnableTransactionManagement
public class CoreContext {

}
