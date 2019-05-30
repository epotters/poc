package authorization.config;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.code.AuthorizationCodeServices;
import org.springframework.security.oauth2.provider.code.InMemoryAuthorizationCodeServices;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import poc.core.config.CoreContext;


@Configuration
@Import(CoreContext.class)
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

  private final UserDetailsService userAccountsService;
  private final ClientDetailsService clientAccountsService;
  private final AuthenticationManager authenticationManager;
  private final PasswordEncoder passwordEncoder;


  @Autowired
  public AuthorizationServerConfig( //
      @Qualifier("userAccountsServicePropertiesImpl") UserDetailsService userAccountsService,
      @Qualifier("clientAccountsServicePropertiesImpl") ClientDetailsService clientAccountsService,
      AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
    assert (userAccountsService != null);
    this.userAccountsService = userAccountsService;
    assert (clientAccountsService != null);
    this.clientAccountsService = clientAccountsService;
    assert (authenticationManager != null);
    this.authenticationManager = authenticationManager;
    this.passwordEncoder = passwordEncoder;
    assert (passwordEncoder != null);
  }


  @Override
  public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {

    TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
    tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));

    // @formatter:off
    endpoints
        .tokenStore(tokenStore())
        .tokenEnhancer(tokenEnhancerChain)
        .accessTokenConverter(accessTokenConverter())
        .userDetailsService(userAccountsService)
        // .authorizationCodeServices(authorizationCodeServices()) // Enable auth code grant
        .authenticationManager(authenticationManager); // Enable oauth password grants. Not for production use
    // @formatter:on
  }


  @Override
  public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
    clients.withClientDetails(clientAccountsService);
  }


  @Override
  public void configure(AuthorizationServerSecurityConfigurer server) throws Exception {

    // @formatter:off

    // Allow remote checking token validity
//    server
//        .tokenKeyAccess("isAnonymous() || hasAuthority('ROLE_TRUSTED_CLIENT')")
//        .checkTokenAccess("hasAuthority('ROLE_TRUSTED_CLIENT')");
//        .allowFormAuthenticationForClients();

    server
        .tokenKeyAccess("permitAll()")
        .checkTokenAccess("isAuthenticated()")
        .passwordEncoder(passwordEncoder);
    ;
//
//        .and().httpBasic()
//        .and().csrf().disable();

    // @formatter:on
  }


  @Bean
  public TokenEnhancer tokenEnhancer() {
    return new CustomTokenEnhancer();
  }


  @Bean
  public JwtAccessTokenConverter accessTokenConverter() {
    JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
    converter.setSigningKey(ServerSecurityConfig.SIGNING_KEY);
    return converter;
  }

  @Bean
  public TokenStore tokenStore() {
    return new JwtTokenStore(accessTokenConverter());
  }


  @Bean
  @Primary
  public DefaultTokenServices tokenServices() {
    DefaultTokenServices tokenServices = new DefaultTokenServices();
    tokenServices.setSupportRefreshToken(true);
    tokenServices.setTokenStore(this.tokenStore());
    return tokenServices;
  }


  @Bean
  public AuthorizationCodeServices authorizationCodeServices() {
    return new InMemoryAuthorizationCodeServices();
  }

}
