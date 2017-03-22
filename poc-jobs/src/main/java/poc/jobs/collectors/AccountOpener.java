package poc.jobs.collectors;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import poc.jobs.collectors.impl.ImdbDataCollector;
import poc.jobs.collectors.impl.IngDataCollector;
import poc.jobs.collectors.impl.MyGovernmentDataCollector;
import poc.jobs.collectors.impl.OvChipkaartDataCollector;
import poc.jobs.collectors.impl.ParkMobileDataCollector;
import poc.jobs.collectors.impl.PublicLibraryDataCollector;


/**
 * Created by epotters on 2017-02-02
 */
public class AccountOpener {

  private static final Log LOG = LogFactory.getLog(AccountOpener.class);

  private static final String HTML_UNIT = "htmlUnit";
  private static final String FIREFOX = "firefox";
  private static final String CHROME = "chrome";


  public static void main(String[] args) {

    String driverType = HTML_UNIT;
    LOG.info("Starting main application with driver " + driverType);

    WebDriver driver;
    for (AccountType accountType : AccountType.values()) {

      driver = getWebDriver(driverType);

      DataCollector collector = getCollector(driver, accountType);
      LOG.info("Collector initialized: " + accountType.getDisplayName());

      collectorLogin(collector, driver);
    }
  }


  private static void collectorLogin(DataCollector collector, WebDriver driver) {

    try {

      String collectorDisplayName = collector.getType().getDisplayName();

      LOG.info("Logging in " + collectorDisplayName);
      collector.login();

      assert (collector.isLoggedIn());
      LOG.info("Logged in " + collectorDisplayName);

      /*
      LOG.info("Logging out " + collectorDisplayName);
      collector.logout();

      assert (!collector.isLoggedIn());
      LOG.info("Logged out " + collectorDisplayName);
      */

    }
    catch (Exception exception) {
      LOG.info(exception.getMessage());
    }
    finally {
      driver.close();
    }
  }


  private static WebDriver getWebDriver(String driverType) {

    switch (driverType) {
      case FIREFOX:
        return new FirefoxDriver();
      case CHROME:
        String chromeDriverPath = "C:\\Program Files\\Chrome Driver\\chromedriver.exe";
        System.setProperty("webdriver.chrome.driver", chromeDriverPath);
        return new ChromeDriver();
      case HTML_UNIT:
        return new HtmlUnitDriver(true);
      default:
        return new HtmlUnitDriver(true);
    }
  }


  private static DataCollector getCollector(WebDriver driver, AccountType accountType) {
    switch (accountType) {
      case IMDB:
        return new ImdbDataCollector(driver);
      case ING:
        return new IngDataCollector(driver);
      case MY_GOVERNMENT:
        return new MyGovernmentDataCollector(driver);
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
