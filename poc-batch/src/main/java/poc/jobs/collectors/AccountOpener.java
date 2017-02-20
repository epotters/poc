package poc.jobs.collectors;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;


/**
 * Created by epotters on 2017-02-02
 */
public class AccountOpener {

  private static final Log LOG = LogFactory.getLog(AccountOpener.class);


  public static void main(String[] args) {

    LOG.info("Starting main application");

    System.setProperty("webdriver.chrome.driver", "C:\\Program Files\\Chrome Driver\\chromedriver.exe");
    WebDriver driver = new ChromeDriver();

    // WebDriver driver = new FirefoxDriver();

    DataCollector collector = getCollector(driver, AccountType.OV_CHIPCARD);

    try {

      String collectorDisplayName = collector.getType().getDisplayName();

      LOG.info("Logging in " + collectorDisplayName);
      collector.login();

      assert(collector.isLoggedIn());
      LOG.info("Logged in " + collectorDisplayName);

      LOG.info("Logging out " + collectorDisplayName);
      collector.logout();

      assert(!collector.isLoggedIn());
      LOG.info("Logged out " + collectorDisplayName);

    }
    catch (Exception exception) {
      LOG.info(exception.getMessage());
    }
    finally {
      driver.close();
    }

  }


  private static DataCollector getCollector(WebDriver driver, AccountType accountType) {
    switch (accountType) {
      case IMDB:
        return new ImdbDataCollector(driver);
      case ING:
        return new IngDataCollector(driver);
      case OV_CHIPCARD:
        return new OvChipkaartDataCollector(driver);
      case PARK_MOBILE:
        return new ParkMobileDataCollector(driver);
      case PUBLIC_LIBRARY:
        return new PublicLibraryDataCollector(driver);
      default:
        return null;
    }
  }

}
