package poc.web.api.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import poc.web.api.config.security.RestAuthenticationEntryPoint;
import poc.web.api.config.security.RestAuthenticationSuccessHandler;
import poc.web.api.config.security.RestLogoutSuccessHandler;


@Configuration
//@EnableResourceServer
@ComponentScan("poc.web.api.config.security")
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

  private static final String RESOURCE_ID = "poc-api";

  private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
  private final RestAuthenticationSuccessHandler restAuthenticationSuccessHandler;
  private final RestLogoutSuccessHandler restLogoutSuccessHandler;
  private final ResourceServerTokenServices tokenServices;
//  private final TokenStore tokenStore;
//  private final JwtAccessTokenConverter accessTokenConverter;


  @Autowired
  ResourceServerConfig( //
      RestAuthenticationEntryPoint restAuthenticationEntryPoint, //
      RestAuthenticationSuccessHandler restAuthenticationSuccessHandler, //
      RestLogoutSuccessHandler restLogoutSuccessHandler, //
      ResourceServerTokenServices tokenServices //
  ) {
    this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
    this.restAuthenticationSuccessHandler = restAuthenticationSuccessHandler;
    this.restLogoutSuccessHandler = restLogoutSuccessHandler;
    this.tokenServices = tokenServices;
  }


  @Override
  public void configure(HttpSecurity http) throws Exception {

    // @formatter:off
    http.authorizeRequests()
        .antMatchers("/").permitAll()

        .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
        .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("admin")


        .antMatchers("/login/oauth2/code/keycloak").permitAll()
//        .antMatchers("/logout").permitAll()


        .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .antMatchers("/api/**").authenticated();


//        .anyRequest().authenticated();

//        .and().httpBasic()
//        .and().csrf().disable();

//    http.exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint);


//    http
//        .formLogin().loginPage("/login").permitAll()
//        .successHandler(restAuthenticationSuccessHandler)
//        .failureHandler(new SimpleUrlAuthenticationFailureHandler());
//
//    http.logout().logoutSuccessHandler(restLogoutSuccessHandler);

    // @formatter:on
  }


  @Override
  public void configure(ResourceServerSecurityConfigurer resources) {
    // @formatter:off
    resources
        .tokenServices(tokenServices)
        .resourceId(RESOURCE_ID);
    // @formatter:on
  }


  @Bean
  public SimpleUrlAuthenticationFailureHandler restFailureHandler() {
    return new SimpleUrlAuthenticationFailureHandler();
  }
}
