package poc.jobs.collectors;


import lombok.Data;


/**
 * Created by epotters on 2017-02-13
 */

@Data
public class UserAccount {

  private String displayName;
  private String username;
  private String password;

  private AccountType type;
}
