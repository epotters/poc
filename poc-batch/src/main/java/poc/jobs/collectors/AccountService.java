package poc.jobs.collectors;


/**
 * Created by epotters on 13-2-2017.
 */
public interface AccountService {

  UserAccount getByType(AccountType type);


  UserAccount getByTypeAndUser(AccountType type, String userName);
}
