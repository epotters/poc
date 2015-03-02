package poc.core.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;





/**
 * Created by epotters on 17-11-2014.
 */
@Configuration
@EnableJpaRepositories("poc.core.repository")
@EnableTransactionManagement

@EnableSpringDataWebSupport
public class PersistenceJpaConfig {

  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

    LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();

    em.setPackagesToScan("poc.core.model");

    // em.setDataSource(dataSourceMySql());
    em.setDataSource(dataSourceH2());
    JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    em.setJpaVendorAdapter(vendorAdapter);

    em.setJpaProperties(additionalProperties());

    return em;
  }


  @Bean
  public DataSource dataSourceMySql() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
    dataSource.setUrl("jdbc:mysql://localhost:3306/poc");
    dataSource.setUsername("epo");
    dataSource.setPassword("123456");
    return dataSource;
  }

  @Bean
  public DataSource dataSourceH2() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName("org.h2.Driver");
    // dataSource.setUrl("jdbc:h2:file:h2/db");
    dataSource.setUrl("jdbc:h2:mem:db");
    dataSource.setUsername("sa");
    dataSource.setPassword("");
    return dataSource;
  }


  @Bean
  public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
    JpaTransactionManager transactionManager = new JpaTransactionManager();
    transactionManager.setEntityManagerFactory(emf);
    return transactionManager;
  }


  @Bean
  public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
    return new PersistenceExceptionTranslationPostProcessor();
  }


  protected Properties additionalProperties() {
    Properties properties = new Properties();

    // properties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect");
    // properties.setProperty("hibernate.hbm2ddl.auto", "");


    properties.setProperty("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
    properties.setProperty("hibernate.hbm2ddl.auto", "create-drop");

    return properties;
  }

}
