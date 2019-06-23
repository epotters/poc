package poc.test.config;


import java.util.ArrayList;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;


@Configuration
@Slf4j
@EnableConfigurationProperties({OAuth2ClientProperties.class})
@PropertySource({"classpath:application-test.yml"})
public class OAuth2RestTemplateConfigurer {

  private static final String OIDC_PROVIDER_KEY = "keycloak";


  @Bean
  public OAuth2RestTemplate oauth2RestTemplate(AuthorizationCodeResourceDetails details) {

    assert (details != null);

    OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(details);

    log.debug("Begin OAuth2RestTemplate: getAccessToken");
    /* To validate if required configurations are in place during startup */
    oAuth2RestTemplate.getAccessToken();

    log.debug("End OAuth2RestTemplate: getAccessToken");
    return oAuth2RestTemplate;
  }

  /*
  TODO: fix error: UserRedirectRequiredException "A redirect is required to get the users approval"
  */

  @Bean
  public AuthorizationCodeResourceDetails details(OAuth2ClientProperties oAuth2ClientProperties) {

    assert (oAuth2ClientProperties != null);
    log.debug("Registration: " + oAuth2ClientProperties.toString());

    OAuth2ClientProperties.Registration registration = oAuth2ClientProperties.getRegistration().get(OIDC_PROVIDER_KEY);
    OAuth2ClientProperties.Provider provider = oAuth2ClientProperties.getProvider().get(OIDC_PROVIDER_KEY);
    assert (registration != null);


    AuthorizationCodeResourceDetails details = new AuthorizationCodeResourceDetails();
    details.setId(OIDC_PROVIDER_KEY);
    details.setClientId(registration.getClientId());
    details.setClientSecret(registration.getClientSecret());
    details.setAccessTokenUri(provider.getTokenUri());
    details.setUserAuthorizationUri(provider.getAuthorizationUri());
    details.setTokenName("oauth_token");
    details.setScope(new ArrayList<>(registration.getScope()));
    details.setPreEstablishedRedirectUri(registration.getRedirectUri());

    details.setUseCurrentUri(false);
    return details;
  }


  @Bean
  public OAuth2ClientContextFilter auth2ClientContextFilter() {
    return new OAuth2ClientContextFilter();
  }


  // Source: https://spring.io/guides/tutorials/spring-boot-oauth2/
  @Bean
  public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
    FilterRegistrationBean<OAuth2ClientContextFilter> registration = new FilterRegistrationBean<>();
    registration.setFilter(filter);
    registration.setOrder(-100);
    return registration;
  }


//  @Autowired
//  private OAuth2ClientProperties oAuth2ClientProperties;


  /*
  security:
    oauth2:
      client:
        registration:
          keycloak:
            client-id: poc-api
            client-secret: 134931f4-6585-4eba-8fa4-564aa5ac27ca
            clientName: Keycloak
            authorization-grant-type: authorization_code
            redirectUriTemplate: '{baseUrl}/login/oauth2/code/{registrationId}'
            scope:
              - openid
              - profile
              - email
        provider:
          keycloak:
            authorization-uri: http://keycloak.localhost/auth/realms/epo/protocol/openid-connect/auth
            token-uri: http://keycloak.localhost/auth/realms/epo/protocol/openid-connect/token
            user-info-uri: http://keycloak.localhost/auth/realms/epo/protocol/openid-connect/userinfo
            jwk-set-uri: http://keycloak.localhost/auth/realms/epo/protocol/openid-connect/certs
            user-name-attribute: preferred_username
   */

//  @Value("${spring.security.oauth2.provider.keycloak.token-uri}")
//  private String accessTokenUri;
//
//  @Value("${spring.security.oauth2.provider.keycloak.authorization-uri}")
//  private String userAuthorizationUri;
//
//  @Value("${spring.security.oauth2.registration.keycloak.client-id}")
//  private String clientID;
//
//  @Value("${spring.security.oauth2.registration.keycloak.client-secret}")
//  private String clientSecret;


//  @Bean
//  public OAuth2ProtectedResourceDetails details() {
//    AuthorizationCodeResourceDetails details = new AuthorizationCodeResourceDetails();
//    details.setId("keycloak");
//    details.setClientId(clientID);
//    details.setClientSecret(clientSecret);
//    details.setAccessTokenUri(accessTokenUri);
//    details.setUserAuthorizationUri(userAuthorizationUri);
//    details.setTokenName("oauth_token");
//    details.setScope(Arrays.asList("openid", "profine", "email"));
//    details.setPreEstablishedRedirectUri("http://localhost/login/oauth2/code/keycloak");
//    details.setUseCurrentUri(false);
//    return details;
//  }

}
