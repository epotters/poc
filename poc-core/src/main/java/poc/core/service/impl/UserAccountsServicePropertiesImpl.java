package poc.core.service.impl;


import java.util.ResourceBundle;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import poc.core.domain.UserAccount;
import poc.core.domain.UserRole;
import poc.core.service.UserAccountsService;


@Component
public class UserAccountsServicePropertiesImpl implements UserAccountsService {

  private static final Log LOG = LogFactory.getLog(UserAccountsServicePropertiesImpl.class);

  private static final String USER_ACCOUNTS_PROPERTY_PATH = "user-accounts";
  private ResourceBundle userAccounts = ResourceBundle.getBundle(USER_ACCOUNTS_PROPERTY_PATH);


  @Override
  public UserAccount loadUserAccountByUsername(String username) throws UsernameNotFoundException {
    return loadUserAccountFromProperties(username);
  }


  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return loadUserAccountFromProperties(username);
  }


  private UserAccount loadUserAccountFromProperties(String username) {

    LOG.debug("Loading user named " + username);

    if (!userAccounts.getString(username + ".password").equals("")) {

      UserAccount userAccount = new UserAccount();
      userAccount.setUsername(username);
      userAccount.setPassword(userAccounts.getString(username + ".password"));
      userAccount.setDisplayName(userAccounts.getString(username + ".displayName"));
      userAccount.setMail(userAccounts.getString(username + ".mail"));

      UserRole authority;
      for (String roleName : userAccounts.getString(username + ".roles").split(",")) {
        authority = new UserRole(roleName);
        userAccount.addAuthority(authority);
      }
      return userAccount;
    } else {
      throw new UsernameNotFoundException("User name: " + username + " not found");
    }

  }
}
