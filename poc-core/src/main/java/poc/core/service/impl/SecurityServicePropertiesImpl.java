package poc.core.service.impl;


import java.util.ResourceBundle;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import poc.core.domain.UserAccount;
import poc.core.domain.UserRole;
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

      UserAccount userAccount = new UserAccount();
      userAccount.setUsername(username);
      userAccount.setPassword(accounts.getString(username + ".password"));
      userAccount.setDisplayName(accounts.getString(username + ".displayName"));

      UserRole authority;
      for (String roleName : accounts.getString(username + ".roles").split(",")) {
        authority = new UserRole(roleName);
        userAccount.addAuthority(authority);
      }
      return userAccount;
    }
    else {
      throw new UsernameNotFoundException("User name: " + username + " not found");
    }
  }
}
