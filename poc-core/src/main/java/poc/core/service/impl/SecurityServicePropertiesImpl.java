package poc.core.service.impl;


import java.util.ResourceBundle;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import poc.core.domain.Account;
import poc.core.service.SecurityService;


@Component
public class SecurityServicePropertiesImpl implements SecurityService {

  private static final Log LOG = LogFactory.getLog(SecurityServicePropertiesImpl.class);

  private static final String ACCOUNTS_PROPERTY_PATH = "accounts";
  private ResourceBundle accounts = ResourceBundle.getBundle(ACCOUNTS_PROPERTY_PATH);


  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    LOG.debug("Loading user named " + username);

    if (!accounts.getString(username + ".password").equals("")) {

      Account account = new Account();
      account.setUsername(username);
      account.setPassword(accounts.getString(username + ".password"));
      account.setDisplayName(accounts.getString(username + ".displayName"));

      SimpleGrantedAuthority authority;
      for (String role : accounts.getString(username + ".roles").split(",")) {
        authority = new SimpleGrantedAuthority(role);
        account.addAuthority(authority);
      }
      return account;
    }
    else {
      throw new UsernameNotFoundException(username + " not found");
    }
  }
}
