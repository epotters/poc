package poc.jobs.collectors;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;


/**
 * Created by epotters on 2-2-2017.
 */
public class AccountOpener {

  private static final Log LOG = LogFactory.getLog(AccountOpener.class);


  public static void main(String[] args) {

    LOG.info("Starting main application");

    WebDriver driver = new FirefoxDriver();

    DataCollector collector = new ImdbDataCollector(driver);
    // DataCollector collector = new IngDataCollector(driver);
    // DataCollector collector = new OvChipkaartDataCollector(driver);
    // DataCollector collector = new ParkMobileDataCollector(driver);
    // DataCollector collector = new PublicLibraryDataCollector(driver);

    try {

      String collectorDisplayName = collector.getType().getDisplayName();

      LOG.info("Logging in " + collectorDisplayName);
      collector.login();

      collector.isLoggedIn();
      LOG.info("Logged in " + collectorDisplayName);

      LOG.info("Logging out " + collectorDisplayName);
      collector.logout();

      collector.isLoggedIn();
      LOG.info("Logged out " + collectorDisplayName);

      // collector.collect();
    }
    catch (Exception exception) {
      LOG.info(exception.getMessage());
    } finally {
      driver.close();
    }

  }

}
