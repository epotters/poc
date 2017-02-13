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

    //DataCollector collector = new IngDataCollector(driver);
    DataCollector collector = new ImdbDataCollector(driver);
    // DataCollector collector = new OvChipkaartDataCollector(driver);
    // DataCollector collector = new ParkMobileDataCollector(driver);
    // DataCollector collector = new PublicLibraryDataCollector(driver);

    try {
      /*
      LOG.info("Logging in");
      collector.login();
      LOG.info("Logged in");
      */

      collector.collect();
    }
    catch (Exception exception) {
      LOG.info(exception.getMessage());
    } finally {
      driver.close();
    }

  }

}
