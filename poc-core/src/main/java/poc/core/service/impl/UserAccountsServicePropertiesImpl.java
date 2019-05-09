package poc.core.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
  private final ResourceBundle userAccounts = ResourceBundle.getBundle(USER_ACCOUNTS_PROPERTY_PATH);


  @Override
  public List<UserAccount> findAll() {
    List<UserAccount> userAccountList = new ArrayList<>();
    for (String key : userAccounts.keySet()) {
      if (key.contains(".displayName")) {
        String username = key.split(".")[0];
        userAccountList.add(loadUserAccountFromProperties(username));
      }
    }
    return userAccountList;
  }


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

    String passwordKey = username + ".password";
    if (userAccounts.containsKey(passwordKey) && !userAccounts.getString(passwordKey).equals("")) {

      UserAccount userAccount = new UserAccount();
      userAccount.setUsername(username);
      userAccount.setPassword(userAccounts.getString(username + ".password"));
      userAccount.setDisplayName(userAccounts.getString(username + ".displayName"));
      userAccount.setMail(userAccounts.getString(username + ".mail"));

      UserRole authority;
      for (String roleName : userAccounts.getString(username + ".roles").split(",")) {

        try {
          UserRole role = UserRole.valueOf(roleName);
          userAccount.addAuthority(role);
        } catch(IllegalArgumentException iae) {
          LOG.info("Skipping role " + roleName + " for user account " + username + ". Role does not exist.");
          LOG.debug("IllegalArgumentException: " + iae.getLocalizedMessage());
        }
      }
      return userAccount;

    } else {
      throw new UsernameNotFoundException("User name: " + username + " not found");
    }

  }
}
