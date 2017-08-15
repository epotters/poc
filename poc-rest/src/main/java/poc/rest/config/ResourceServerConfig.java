package poc.rest.config;


import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import poc.rest.config.security.RestAuthenticationEntryPoint;
import poc.rest.config.security.RestAuthenticationSuccessHandler;
import poc.rest.config.security.RestLogoutSuccessHandler;


@Configuration
@EnableResourceServer
@ComponentScan("poc.rest.config.security")
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

  private static final Log LOG = LogFactory.getLog(ResourceServerConfig.class);

  private static final String RESOURCE_ID = "api";

  @Autowired
  private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

  @Autowired
  private RestAuthenticationSuccessHandler restAuthenticationSuccessHandler;

  @Autowired
  private RestLogoutSuccessHandler restLogoutSuccessHandler;

  @Autowired
  private UserDetailsService securityService;


  @Override
  public void configure(HttpSecurity http) throws Exception {

    http.httpBasic();

    http.csrf().disable();

    // @formatter:off
    http.authorizeRequests()
        .antMatchers("/").permitAll()
        .antMatchers("/logout").permitAll()
        .antMatchers("/api/**").authenticated()
        .anyRequest().fullyAuthenticated().and().httpBasic();

    http.exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint);

    http.formLogin().loginPage("/login").permitAll().successHandler(restAuthenticationSuccessHandler)
        .failureHandler(new SimpleUrlAuthenticationFailureHandler());

    http.logout().logoutSuccessHandler(restLogoutSuccessHandler);

    // @formatter:on
  }

  @Override
  public void configure(ResourceServerSecurityConfigurer resources) {
    // @formatter:off
    resources
        .resourceId(RESOURCE_ID);
    // @formatter:on
  }


  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(securityService);
    authProvider.setPasswordEncoder( new BCryptPasswordEncoder());
    return authProvider;
  }


  @Bean
  public RestAuthenticationSuccessHandler restAuthenticationSuccessHandler() {
    return new RestAuthenticationSuccessHandler();
  }


  @Bean
  public SimpleUrlAuthenticationFailureHandler restFailureHandler() {
    return new SimpleUrlAuthenticationFailureHandler();
  }
}
