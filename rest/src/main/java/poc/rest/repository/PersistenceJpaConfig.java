package poc.rest.repository;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;


/**
 * Created by epotters on 17-11-2014.
 */
@Configuration
@EnableTransactionManagement
public class PersistenceJpaConfig {

  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
    LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();

    em.setPackagesToScan(new String[] {
        "poc.core.model"
    });


    // em.setDataSource(dataSource());
    // JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    // em.setJpaVendorAdapter(vendorAdapter);
    // em.setJpaProperties(additionalProperties());

    return em;
  }

}
