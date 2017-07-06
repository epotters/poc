package poc.rest.config;


import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import poc.rest.config.security.RestAuthenticationEntryPoint;
import poc.rest.config.security.RestAuthenticationSuccessHandler;


@Configuration
@EnableWebSecurity
@ComponentScan("poc.rest.config.security")
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private static final Log LOG = LogFactory.getLog(SecurityConfig.class);

  @Autowired
  private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

  @Autowired
  private RestAuthenticationSuccessHandler authenticationSuccessHandler;

  @Autowired
  private UserDetailsService securityService;


  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.authenticationProvider(authenticationProvider());
  }


  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(securityService);
    return authProvider;
  }


  @Override
  protected void configure(HttpSecurity http) throws Exception {

    http.httpBasic();

    http.csrf().disable();

    http.authorizeRequests()
        .antMatchers("/").permitAll()
        .antMatchers("/login").permitAll()
        .antMatchers("/logout").permitAll()
        .antMatchers("/api/**").authenticated()
        .anyRequest().fullyAuthenticated();

    http.exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint);
    http.formLogin()
        .successHandler(authenticationSuccessHandler)
        .failureHandler(new SimpleUrlAuthenticationFailureHandler())
        .and()
        .logout();
  }


  @Bean
  public RestAuthenticationSuccessHandler restSuccessHandler(){
    return new RestAuthenticationSuccessHandler();
  }
  @Bean
  public SimpleUrlAuthenticationFailureHandler restFailureHandler(){
    return new SimpleUrlAuthenticationFailureHandler();
  }
}
