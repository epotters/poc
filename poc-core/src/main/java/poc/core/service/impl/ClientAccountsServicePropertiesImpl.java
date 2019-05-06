package poc.core.service.impl;


import java.util.Arrays;
import java.util.HashSet;
import java.util.ResourceBundle;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientRegistrationException;
import org.springframework.stereotype.Component;

import poc.core.domain.ClientAccount;
import poc.core.domain.UserRole;
import poc.core.service.ClientAccountsService;


@Component
public class ClientAccountsServicePropertiesImpl implements ClientAccountsService {

  private static final Log LOG = LogFactory.getLog(ClientAccountsServicePropertiesImpl.class);

  private static final String CLIENT_ACCOUNTS_PROPERTY_PATH = "client-accounts";
  private ResourceBundle clientAccounts = ResourceBundle.getBundle(CLIENT_ACCOUNTS_PROPERTY_PATH);


  @Override
  public ClientDetails loadClientByClientId(String clientId) throws ClientRegistrationException {

    return loadclientAccountFromProperties(clientId);
  }


  @Override
  public ClientAccount loadClientAccountByClientId(String clientId) {

    return loadclientAccountFromProperties(clientId);
  }


  private ClientAccount loadclientAccountFromProperties(String clientId) {

    LOG.debug("Loading client named " + clientId);

    if (!clientAccounts.getString(clientId + ".clientSecret").equals("")) {

      ClientAccount clientAccount = new ClientAccount();
      clientAccount.setClientId(clientId);
      clientAccount.setDisplayName(clientAccounts.getString(clientId + ".displayName"));
      clientAccount.setClientSecret(clientAccounts.getString(clientId + ".clientSecret"));

      Set<String> resourceIds = new HashSet<>();
      resourceIds.addAll(Arrays.asList(clientAccounts.getString(clientId + ".resourceIds").split(",")));
      clientAccount.setResourceIds(resourceIds);

      Set<String> scopes = new HashSet<>();
      scopes.addAll(Arrays.asList(clientAccounts.getString(clientId + ".scopes").split(",")));
      clientAccount.setScopes(scopes);

      Set<String> authorizedGrantTypes = new HashSet<>();
      authorizedGrantTypes.addAll(Arrays.asList(clientAccounts.getString(clientId + ".authorizedGrantTypes").split(",")));
      clientAccount.setAuthorizedGrantTypes(authorizedGrantTypes);

      Set<String> registeredRedirectUris = new HashSet<>();
      registeredRedirectUris.addAll(Arrays.asList(clientAccounts.getString(clientId + ".registeredRedirectUris").split(",")));
      clientAccount.setRegisteredRedirectUris(registeredRedirectUris);

      UserRole authority;
      for (String roleName : clientAccounts.getString(clientId + ".authorities").split(",")) {
        try {
          UserRole role = UserRole.valueOf(roleName);
          clientAccount.addAuthority(role);
        } catch(IllegalArgumentException iae) {
          LOG.info("Skipping role " + roleName + " for client " + clientId + ". Role does not exist");
          LOG.debug("IllegalArgumentException: " + iae.getLocalizedMessage());
        }

      }

      return clientAccount;
    } else {
      throw new UsernameNotFoundException("Client ID \" " + clientId + "\" not found");
    }
  }
}
