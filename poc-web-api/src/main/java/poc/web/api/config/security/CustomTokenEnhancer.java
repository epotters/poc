package poc.web.api.config.security;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import poc.core.domain.UserAccount;
import poc.core.service.UserAccountsService;


public class CustomTokenEnhancer implements TokenEnhancer {

  @Autowired
  private UserAccountsService userAccountsService;


  @Override
  public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {

    UserAccount userAccount = userAccountsService.loadUserAccountByUsername(authentication.getName());

    Map<String, Object> additionalInfo = new HashMap<>();
    additionalInfo.put("mail", userAccount.getMail());
    ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
    return accessToken;
  }
}
