package poc.web.api.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration

public class ServerSecurityConfig implements WebMvcConfigurer {

  static final String SIGNING_KEY = "12345";

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**");
  }

  @Bean
  @Primary
  public RemoteTokenServices remoteTokenServices() {


    String checkTokenEndpointUrl = "http://localhost:8003/oauth/check_token";
    String clientId = "poc";
    String clientSecret = "9876543210";

    RemoteTokenServices remoteTokenServices = new RemoteTokenServices();
    remoteTokenServices.setCheckTokenEndpointUrl(checkTokenEndpointUrl);
    remoteTokenServices.setClientId(clientId);
    remoteTokenServices.setClientSecret(clientSecret);
    return remoteTokenServices;
  }

  @Bean
  public TokenStore tokenStore() {
    return new JwtTokenStore(accessTokenConverter());
  }

  @Bean
  @Primary
  public JwtAccessTokenConverter accessTokenConverter() {
    JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
    converter.setSigningKey(ServerSecurityConfig.SIGNING_KEY);
    return converter;
  }
}
