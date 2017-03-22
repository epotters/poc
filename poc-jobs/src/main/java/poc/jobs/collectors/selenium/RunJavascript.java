package poc.jobs.collectors.selenium;

/**
 * Created by epotters on 6-2-2017.
 */


import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;


public class RunJavascript {
  public static void main(String[] args) {

    System.setProperty("webdriver.chrome.driver", "/Users/mkyong/Downloads/chromedriver");

    ChromeOptions options = new ChromeOptions();
    options.addArguments("window-size=1024,768");

    DesiredCapabilities capabilities = DesiredCapabilities.chrome();
    capabilities.setCapability(ChromeOptions.CAPABILITY, options);
    WebDriver driver = new ChromeDriver(capabilities);

    driver.get("http://google.com/");

    if (driver instanceof JavascriptExecutor) {
      ((JavascriptExecutor) driver).executeScript("alert('hello world');");
    }

  }
}
