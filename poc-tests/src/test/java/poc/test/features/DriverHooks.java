package poc.test.features;


import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.safari.SafariDriver;

import static org.openqa.selenium.remote.BrowserType.CHROME;
import static org.openqa.selenium.remote.BrowserType.FIREFOX;
import static org.openqa.selenium.remote.BrowserType.HTMLUNIT;
import static org.openqa.selenium.remote.BrowserType.SAFARI;


@Slf4j
public class DriverHooks {

  private static boolean local = true;
  private static final String browserType = CHROME;


  @Getter
  public static final WebDriver DRIVER = getWebDriver(browserType);


  @Before
  public void beforeScenario(Scenario scenario) {
    log.debug("Before scenario " + scenario.getName());
  }

  @After
  public void afterScenario(Scenario scenario) {
    log.info("Scenario " + scenario.getName() + " finished, about to quit the driver");
    DRIVER.quit();
  }


  private static WebDriver getWebDriver(String driverType) {

    switch (driverType) {
      case FIREFOX:
        return new FirefoxDriver();
      case CHROME:
//        String chromeDriverPath = "/usr/local/bin/chromedriver";
//        System.setProperty("webdriver.chrome.driver", chromeDriverPath);
        return new ChromeDriver();
      case SAFARI:
        return new SafariDriver();
      case HTMLUNIT:
        return new HtmlUnitDriver(true);
      default:
        return new HtmlUnitDriver(true);
    }
  }
}
