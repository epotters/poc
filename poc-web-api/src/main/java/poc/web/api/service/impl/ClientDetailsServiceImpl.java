package poc.web.api.service.impl;


import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.ClientRegistrationException;


public class ClientDetailsServiceImpl implements ClientDetailsService {

  @Override
  public ClientDetails loadClientByClientId(String s) throws ClientRegistrationException {
    return null;
  }
}