package poc.jobs.collectors;


import lombok.Data;


/**
 * Created by epotters on 13-2-2017.
 */

@Data
public class UserAccount {

  private String displayName;
  private String username;
  private String password;

  private AccountType type;
}
