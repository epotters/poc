package poc.rest.config.oauth2a;


import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoRestTemplateCustomizer;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;


/**
 * Created by epotters on 2016-01-07
 */
public class CustomOAuth2RestTemplate implements UserInfoRestTemplateCustomizer {

  @Override
  public void customize(OAuth2RestTemplate template) {
    // TODO Auto-generated method stub
    template.setAuthenticator(new GoogleOAuth2Authenticator());
  }
}
