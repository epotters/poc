package poc.core.config;


import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
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


@Configuration
@EnableJpaRepositories("poc.core.repository")
@EnableTransactionManagement

@EnableSpringDataWebSupport
public class PersistenceContext {

  private static final String DB_TYPE_MYSQL = "mysql";
  private static final String DB_TYPE_H2 = "h2";
  private static final String DATABASE_TYPE = DB_TYPE_H2;


  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

    LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();

    em.setPackagesToScan("poc.core.domain");

    em.setDataSource(primaryDataSource());
    JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    em.setJpaVendorAdapter(vendorAdapter);

    em.setJpaProperties(additionalProperties());

    return em;
  }


  public DataSource dataSource() {
    if (DATABASE_TYPE.equals(DB_TYPE_MYSQL)) {
      return primaryDataSource();
    } else { // defaults to H2 database
      return dataSourceH2();
    }
  }


  @Bean
  @Primary
  @ConfigurationProperties(prefix = "datasource.primary")
  public DataSource primaryDataSource() {
    return DataSourceBuilder.create().build();
  }


/*
@Bean
@ConfigurationProperties(prefix="datasource.secondary")
public DataSource secondaryDataSource() {
    return DataSourceBuilder.create().build();
}
*/

/*
  public DataSource dataSourceMySql() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
    dataSource.setUrl("jdbc:mysql://localhost:3306/poc");
    dataSource.setUsername("epo");
    dataSource.setPassword("123456");
    return dataSource;
  }
*/


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
    if (DATABASE_TYPE.equals(DB_TYPE_MYSQL)) {
      properties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
      properties.setProperty("hibernate.hbm2ddl.auto", "");
    } else { // defaults to H2 database
      properties.setProperty("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
      properties.setProperty("hibernate.hbm2ddl.auto", "create-drop");
    }
    return properties;
  }

}
