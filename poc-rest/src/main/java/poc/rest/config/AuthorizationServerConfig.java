package poc.rest.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.InMemoryTokenStore;


@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

  @Autowired
  private UserDetailsService securityService;

  private TokenStore tokenStore = new InMemoryTokenStore();

  @Autowired
  private AuthenticationManager authenticationManager;

  @Value("${poc.oauth.tokenTimeout:3600}")
  private int expiration;


  @Override
  public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {

    // @formatter:off
    endpoints
        .tokenStore(tokenStore)
        .authenticationManager(authenticationManager)
        .userDetailsService(securityService);
    // @formatter:on
  }


  @Override
  public void configure(ClientDetailsServiceConfigurer clients) throws Exception {

    // @formatter:off
    clients.inMemory()
        .withClient("poc")
          .secret("secret")
          .accessTokenValiditySeconds(expiration)
          .scopes("read", "write")
          .authorizedGrantTypes("password", "authorization_code", "client_credentials", "refresh_token", "implicit")
          .authorities("USER", "ADMIN");
     // @formatter:on
  }


  @Override
  public void configure(AuthorizationServerSecurityConfigurer server) throws Exception {

    // @formatter:off
    server
        .tokenKeyAccess("permitAll()")
        .checkTokenAccess("isAuthenticated()");
    // @formatter:on
  }



  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }


  @Bean
  @Primary
  public DefaultTokenServices tokenServices() {
    DefaultTokenServices tokenServices = new DefaultTokenServices();
    tokenServices.setSupportRefreshToken(true);
    tokenServices.setTokenStore(this.tokenStore);
    return tokenServices;
  }

}
