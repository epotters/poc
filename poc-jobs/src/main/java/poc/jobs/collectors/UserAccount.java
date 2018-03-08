package poc.jobs.collectors;


import lombok.Data;


@Data
public class UserAccount {

  private String displayName;
  private String username;
  private String password;

  private AccountType type;
}
