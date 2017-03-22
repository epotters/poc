package poc.jobs.collectors.impl;


import java.io.File;
import java.io.FileOutputStream;
import java.util.logging.Level;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

import lombok.Getter;
import lombok.Setter;
import poc.jobs.collectors.AccountService;
import poc.jobs.collectors.AccountServiceImpl;
import poc.jobs.collectors.AccountType;
import poc.jobs.collectors.UserAccount;
import poc.jobs.collectors.selenium.FileDownloader;


/**
 * Created by epotters on 2017-01-24
 */
@PropertySource("/application.properties")
public class BaseDataCollector {

  private static final Log LOG = LogFactory.getLog(BaseDataCollector.class);


  private static final String READYSTATE_COMPLETE = "complete";
  private static final String READYSTATE_JS = "return document.readyState";

  @Getter
  private AccountType type;

  private AccountService accountService = new AccountServiceImpl();

  @Getter
  @Setter
  private String collectorDisplayName;

  @Getter
  @Setter
  private String collectorName;

  @Value("${collectors.output-path}")
  private String parentOutputPath = "target/collectors";

  @Value("${collectors.screenshots-path}")
  private String screenshotsPath = "screenshots";

  File outputDirectory;

  @Getter
  private UserAccount account;

  @Getter
  protected WebDriver driver;

  @Getter
  private WebDriverWait driverWait;


  BaseDataCollector(AccountType type) {
    this.type = type;
    assert (accountService != null);
    this.account = accountService.getByType(type);
    this.driver = new HtmlUnitDriver(true);
    turnHtmlUnitLoggingOff();
    init();
  }


  BaseDataCollector(AccountType type, WebDriver driver) {
    this.type = type;
    assert (accountService != null);
    this.account = accountService.getByType(type);
    this.driver = driver;
    init();
  }


  protected void init() {
    setCollectorName(getType().getName());
    setCollectorDisplayName(getType().getDisplayName());
    outputDirectory = createOutputDirectory();
    LOG.debug("Output directory: " + outputDirectory.getPath());

    this.driverWait = new WebDriverWait(driver, getDriverWaitTimeOutSecs());
    LOG.debug("Driverwait set");
    assert (getDriverWait() != null);

    createOutputDirectory();
  }


  protected int getDriverWaitTimeOutSecs() {
    return 10;
  }


  private File createOutputDirectory() {
    assert (parentOutputPath != null);
    String collectorOutputPath = parentOutputPath + collectorName;
    // assert((new File(parentOutputPath).canWrite()));
    File outputDirectory = new File(collectorOutputPath);
    assert (outputDirectory.exists() | (!outputDirectory.exists() && outputDirectory.mkdirs()));
    return outputDirectory;
  }


  // Switch off HtmlUnit logging
  private void turnHtmlUnitLoggingOff() {
    LogFactory.getFactory().setAttribute("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.NoOpLog");
    java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit").setLevel(Level.OFF);
    java.util.logging.Logger.getLogger("org.apache.commons.httpclient").setLevel(Level.OFF);
    java.util.logging.Logger.getLogger("org.apache.http.wire").setLevel(Level.INFO);
  }


  void setAttribute(WebElement element, String attributeName, String attributeValue) {
    JavascriptExecutor jse = (JavascriptExecutor) driver;
    String scriptSetAttrValue = "arguments[0].setAttribute(arguments[1],arguments[2])";
    jse.executeScript(scriptSetAttrValue, element, attributeName, attributeValue);

    assert (element.getAttribute(attributeName).equals(attributeValue));
  }


  void setFieldValueUsingJs(WebElement field, String value) {
    setAttribute(field, "value", value);
  }


  WebElement waitForElementPresence(String elementId) {
    final int timeout = 15;
    return (new WebDriverWait(driver, timeout)).until(ExpectedConditions.presenceOfElementLocated(By.id(elementId)));
  }


  protected void waitForCondition(ExpectedCondition<? extends Object> expectedCondition) {
    try {
      WebDriverWait webDriverWait = new WebDriverWait(getDriver(), 30);
      webDriverWait.until(expectedCondition);
    }
    catch (TimeoutException timeoutException) {
      this.takePicture("Fail-" + expectedCondition.toString());
      sleep();
      Assert.fail("Condition not met in time: " + expectedCondition.toString());
    }
  }


  protected void clickAndWaitForNewPage(WebElement elementToActivate) {
    ExpectedCondition<? extends Object> expectedCondition = (webdrv) -> {
      return elementToActivate.isEnabled();
    };
    this.waitForCondition(expectedCondition);
    elementToActivate.click();
    LOG.debug("Element clicked, now waiting for the element to go stale");
    this.waitForCondition(ExpectedConditions.stalenessOf(elementToActivate));
    LOG.debug("Element is now stale");
    this.waitForCondition((webdrv) -> {
      return READYSTATE_COMPLETE.equals(((JavascriptExecutor) webdrv).executeScript(READYSTATE_JS, new Object[0]));
    });
  }


  protected void activateAndWaitForNewPage(WebElement elementToActivate) {

    ExpectedCondition<? extends Object> expectedCondition = (webdrv) -> {
      return elementToActivate.isEnabled();
    };

    elementToActivate.sendKeys(Keys.ENTER);
    LOG.debug("Element activated, now waiting for the element to go stale");

    this.waitForCondition(ExpectedConditions.stalenessOf(elementToActivate));
    LOG.debug("Element is now stale");
    this.waitForCondition((webdrv) -> {
      return READYSTATE_COMPLETE.equals(((JavascriptExecutor) webdrv).executeScript(READYSTATE_JS, new Object[0]));
    });
  }


  public void takePicture(String fileName) {
    try {

      if (driver instanceof RemoteWebDriver) {
        driver = (new Augmenter()).augment(driver);
      }

      String fullScreenshotsPath = parentOutputPath + screenshotsPath;

      File screenshotsDirectory = new File(fullScreenshotsPath);
      assert (screenshotsDirectory.exists() || (!screenshotsDirectory.exists() && screenshotsDirectory.mkdirs()));

      File screenshot = new File(fullScreenshotsPath + fileName.replaceAll("\\W+", "") + ".png");
      FileOutputStream out = new FileOutputStream(screenshot);

      out.write((byte[]) ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES));
      out.close();
    }
    catch (Exception ex) {
      LOG.error("Failed creating screenshot " + ex);
    }

  }


  protected static void sleep() {
    try {
      Thread.sleep(1000L);
    }
    catch (Exception var1) {
      LOG.info("Sleep interrupted");
    }
  }


  public static void sleep(int seconds) {
    for (int n = 0; n < seconds; ++n) {
      sleep();
    }
  }


  protected FileDownloader createFileDownloader() {
    return new FileDownloader(this.getDriver());
  }


  protected void executeJavascript(String script) {

    if (driver instanceof JavascriptExecutor) {
      ((JavascriptExecutor) driver).executeScript(script);
    }
  }

}
