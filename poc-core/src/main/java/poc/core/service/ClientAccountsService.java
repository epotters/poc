package poc.core.service;


import org.springframework.security.oauth2.provider.ClientDetailsService;

import poc.core.domain.ClientAccount;


public interface ClientAccountsService extends ClientDetailsService {

  ClientAccount loadClientAccountByClientId(String clientId);
}
