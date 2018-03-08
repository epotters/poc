package poc.jobs.collectors;


import java.util.ResourceBundle;

import org.springframework.stereotype.Component;


@Component
public class AccountServiceImpl implements AccountService {

  private static final String ACCOUNTS_PROPERTY_PATH = "collectors.accounts";
  private static final String ACCOUNT_PROPERTY_PATH = "account";


  @Override
  public UserAccount getByType(AccountType type) {

    ResourceBundle accounts = ResourceBundle.getBundle(ACCOUNTS_PROPERTY_PATH);
    UserAccount account = new UserAccount();

    account.setType(type);
    account.setDisplayName(accounts.getString(type.buildKeyForType(ACCOUNT_PROPERTY_PATH) + "displayName"));
    account.setUsername(accounts.getString(type.buildKeyForType(ACCOUNT_PROPERTY_PATH) + "username"));
    account.setPassword(accounts.getString(type.buildKeyForType(ACCOUNT_PROPERTY_PATH) + "password"));

    return account;
  }


  @Override
  public UserAccount getByTypeAndUser(AccountType type, String userName) {
    return null;
  }
}
