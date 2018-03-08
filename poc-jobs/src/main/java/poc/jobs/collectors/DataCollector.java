package poc.jobs.collectors;


public interface DataCollector {

  AccountType getType();

  void login() throws Exception;

  boolean isLoggedIn() throws Exception;

  // void navigate();

  // void filter();

  void collect() throws Exception;

  // void compare();

  // void save();

  void logout();

}
