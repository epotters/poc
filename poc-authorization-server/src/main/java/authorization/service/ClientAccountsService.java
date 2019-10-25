package authorization.service;


import authorization.domain.ClientAccount;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;


public interface ClientAccountsService extends ClientDetailsService {

  ClientDetails loadClientAccountByClientId(String clientId);
}
