package poc.rest.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import poc.rest.config.security.RestAuthenticationEntryPoint;
import poc.rest.config.security.RestAuthenticationSuccessHandler;
import poc.rest.config.security.RestLogoutSuccessHandler;


@Configuration
@EnableResourceServer
@ComponentScan("poc.rest.config.security")
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

  private static final String RESOURCE_ID = "poc-api";

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


  @Override
  public void configure(HttpSecurity http) throws Exception {

    // @formatter:off
    http.authorizeRequests()
        .antMatchers("/").permitAll()

        .requestMatchers(EndpointRequest.to("health", "info")).permitAll() // Actuator rules per endpoint
        .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("admin") // Actuator general rules

        .antMatchers("/logout").permitAll()
        .antMatchers(HttpMethod.OPTIONS).permitAll()

        .antMatchers("/api/**").authenticated()

        .antMatchers("/oauth/**").permitAll()

        .anyRequest().authenticated()
        .and().httpBasic()
        .and().csrf().disable();

    http.exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint);

    http
        .formLogin().loginPage("/login").permitAll()
        .successHandler(restAuthenticationSuccessHandler)
        .failureHandler(new SimpleUrlAuthenticationFailureHandler());

    http.logout().logoutSuccessHandler(restLogoutSuccessHandler);

    // @formatter:on
  }


  @Override
  public void configure(ResourceServerSecurityConfigurer resources) {
    // @formatter:off
    resources
        .tokenServices(tokenServices())
        .resourceId(RESOURCE_ID);
    // @formatter:on
  }


  @Bean
  public SimpleUrlAuthenticationFailureHandler restFailureHandler() {
    return new SimpleUrlAuthenticationFailureHandler();
  }


  @Bean
  public TokenStore tokenStore() {
    return new JwtTokenStore(accessTokenConverter());
  }


  @Bean
  public JwtAccessTokenConverter accessTokenConverter() {
    JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
    converter.setSigningKey(ServerSecurityConfig.SIGNING_KEY);
    return converter;
  }


  @Bean
  @Primary
  public ResourceServerTokenServices tokenServices() {
    DefaultTokenServices tokenServices = new DefaultTokenServices();
    tokenServices.setSupportRefreshToken(true);
    tokenServices.setTokenStore(this.tokenStore());
    return tokenServices;
  }
}
