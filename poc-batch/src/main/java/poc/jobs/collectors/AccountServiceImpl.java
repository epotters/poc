package poc.jobs.collectors;


import java.util.ResourceBundle;

import org.springframework.stereotype.Component;


/**
 * Created by epotters on 13-2-2017-02-13
 */
@Component
public class AccountServiceImpl implements AccountService {
  private static final String DOT = ".";

  private String accountsPropertyPath = "collectors.accounts";
  private String accountPropertyPath = "account";


  @Override
  public UserAccount getByType(AccountType type) {

    ResourceBundle accounts = ResourceBundle.getBundle(accountsPropertyPath);
    UserAccount account = new UserAccount();

    account.setType(type);
    account.setDisplayName(accounts.getString(type.buildKeyForType(accountPropertyPath) + "displayName"));
    account.setUsername(accounts.getString(type.buildKeyForType(accountPropertyPath) + "username"));
    account.setPassword(accounts.getString(type.buildKeyForType(accountPropertyPath) + "password"));

    return account;
  }


  @Override
  public UserAccount getByTypeAndUser(AccountType type, String userName) {
    return null;
  }
}
