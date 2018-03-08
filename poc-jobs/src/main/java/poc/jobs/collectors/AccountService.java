package poc.jobs.collectors;


public interface AccountService {

  UserAccount getByType(AccountType type);

  UserAccount getByTypeAndUser(AccountType type, String userName);
}
