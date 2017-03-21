package poc.jobs.collectors;


/**
 * Created by epotters on 2017-02-13
 */
public interface AccountService {

  UserAccount getByType(AccountType type);


  UserAccount getByTypeAndUser(AccountType type, String userName);
}
