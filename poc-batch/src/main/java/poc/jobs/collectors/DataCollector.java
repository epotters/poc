package poc.jobs.collectors;


import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * Created by epotters on 2017-01-24
 */
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
