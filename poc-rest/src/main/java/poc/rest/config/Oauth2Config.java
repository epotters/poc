package poc.rest.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;


@Configuration
@EnableAuthorizationServer
public class Oauth2Config extends AuthorizationServerConfigurerAdapter {

  @Autowired
  private UserDetailsService securityService;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Value("${poc.oauth.tokenTimeout:3600}")
  private int expiration;


  @Override
  public void configure(AuthorizationServerEndpointsConfigurer configurer) throws Exception {
    configurer.authenticationManager(authenticationManager);
    configurer.userDetailsService(securityService);
  }


  @Override
  public void configure(ClientDetailsServiceConfigurer clients) throws Exception {

    // @formatter:off
    clients.inMemory()
        .withClient("poc")
          .secret("secret")
          .accessTokenValiditySeconds(expiration)
          .scopes("read", "write")
          .authorizedGrantTypes("password", "refresh_token")
          .resourceIds("resource");
     // @formatter:on
  }


  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
