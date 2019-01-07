package poc.core.config;


import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EnableAutoConfiguration
@EntityScan(basePackages = { "poc.core.domain", "org.springframework.data.jpa.convert.threeten" })
@EnableJpaRepositories(basePackages = { "poc.core.repository" })
@ComponentScan(basePackages = { "poc.core.service" })
@EnableTransactionManagement
public class CoreContext {

}
