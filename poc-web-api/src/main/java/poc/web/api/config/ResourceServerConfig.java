package poc.web.api.config;


    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.ComponentScan;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.HttpMethod;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
    import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
    import poc.web.api.config.security.RestAuthenticationEntryPoint;
    import poc.web.api.config.security.RestAuthenticationSuccessHandler;
    import poc.web.api.config.security.RestLogoutSuccessHandler;


@Configuration
@EnableWebSecurity
@ComponentScan("poc.web.api.config.security")
public class ResourceServerConfig extends WebSecurityConfigurerAdapter { // extends ResourceServerConfigurerAdapter {

  private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
  private final RestAuthenticationSuccessHandler restAuthenticationSuccessHandler;
  private final RestLogoutSuccessHandler restLogoutSuccessHandler;


  @Autowired
  ResourceServerConfig( //
      RestAuthenticationEntryPoint restAuthenticationEntryPoint, //
      RestAuthenticationSuccessHandler restAuthenticationSuccessHandler, //
      RestLogoutSuccessHandler restLogoutSuccessHandler //
  ) {
    this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
    this.restAuthenticationSuccessHandler = restAuthenticationSuccessHandler;
    this.restLogoutSuccessHandler = restLogoutSuccessHandler;
  }

  /*
  https://docs.spring.io/spring-security/site/docs/5.2.x/api/org/springframework/security/config/annotation/web/configurers/oauth2/server/resource/OAuth2ResourceServerConfigurer.html
   */
  @Override
  public void configure(HttpSecurity http) throws Exception {

    // @formatter:off
    http.authorizeRequests()
        .antMatchers("/").permitAll()

        .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
        .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("admin")
        .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .antMatchers("/api/**").authenticated()

        .and()
        .oauth2ResourceServer()
        .jwt();

//    http.exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint);
//    http
//        .formLogin().loginPage("/login").permitAll()
//        .successHandler(restAuthenticationSuccessHandler)
//        .failureHandler(new SimpleUrlAuthenticationFailureHandler());
//    http.logout().logoutSuccessHandler(restLogoutSuccessHandler);

    // @formatter:on
  }


//  @Override
//  public void configure(ResourceServerSecurityConfigurer resources) {
//    // @formatter:off
//    resources
//        .tokenServices(tokenServices)
//        .resourceId(RESOURCE_ID);
//    // @formatter:on
//  }


  @Bean
  public SimpleUrlAuthenticationFailureHandler restFailureHandler() {
    return new SimpleUrlAuthenticationFailureHandler();
  }
}
