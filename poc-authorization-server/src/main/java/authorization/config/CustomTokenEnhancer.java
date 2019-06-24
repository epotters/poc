package authorization.config;


import java.util.HashMap;
import java.util.Map;

import authorization.domain.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;


public class CustomTokenEnhancer implements TokenEnhancer {


  private UserDetailsService userAccountsService;

  @Autowired
  public CustomTokenEnhancer(UserDetailsService userAccountsService) {
    this.userAccountsService = userAccountsService;
  }


  @Override
  public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {

    UserDetails userAccount = userAccountsService.loadUserByUsername(authentication.getName());

    Map<String, Object> additionalInfo = new HashMap<>();
    additionalInfo.put("mail", ((UserAccount) userAccount).getMail());
    ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
    return accessToken;
  }
}
