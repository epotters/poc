package poc.test.features.pages;


import java.io.File;
import java.io.FileOutputStream;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static poc.test.features.DriverHooks.DRIVER;


@Slf4j
public class BasePage {

  private static final String READYSTATE_COMPLETE = "complete";
  private static final String READYSTATE_JS = "return document.readyState";

  @Getter
  private WebDriverWait driverWait;

  @Getter
  private String screenshotsPath = "./screenshots";

  @Getter
  private int driverWaitTimeOutSecs = 10;

  private int timeToWaitForElement = 15;


  protected void init() {
    this.driverWait = new WebDriverWait(DRIVER, getDriverWaitTimeOutSecs());
    log.debug("Driverwait set");
    assert (getDriverWait() != null);
  }


  protected static void sleep() {
    try {
      Thread.sleep(1000L);
    } catch (Exception e) {
      log.info("Sleep interrupted");
    }
  }

  public static void sleep(int seconds) {
    for (int n = 0; n < seconds; ++n) {
      sleep();
    }
  }


  void setAttribute(WebElement element, String attributeName, String attributeValue) {
    JavascriptExecutor jse = (JavascriptExecutor) DRIVER;
    String scriptSetAttrValue = "arguments[0].setAttribute(arguments[1],arguments[2])";
    jse.executeScript(scriptSetAttrValue, element, attributeName, attributeValue);

    assert (element.getAttribute(attributeName).equals(attributeValue));
  }


  void setFieldValueUsingJs(WebElement field, String value) {
    setAttribute(field, "value", value);
  }


  WebElement waitForElementPresence(String elementId) {
    return (new WebDriverWait(DRIVER, timeToWaitForElement)).until(ExpectedConditions.presenceOfElementLocated(By.id(elementId)));
  }


  protected void waitForCondition(ExpectedCondition<? extends Object> expectedCondition) {
    try {
      WebDriverWait webDriverWait = new WebDriverWait(DRIVER, 30);
      webDriverWait.until(expectedCondition);
    } catch (TimeoutException timeoutException) {
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
    log.debug("Element clicked, now waiting for the element to go stale");
    this.waitForCondition(ExpectedConditions.stalenessOf(elementToActivate));
    log.debug("Element is now stale");
    this.waitForCondition((webdrv) -> {
      return READYSTATE_COMPLETE.equals(((JavascriptExecutor) webdrv).executeScript(READYSTATE_JS, new Object[0]));
    });
  }


  protected void activateAndWaitForNewPage(WebElement elementToActivate) {

    elementToActivate.sendKeys(Keys.ENTER);
    log.debug("Element activated, now waiting for the element to go stale");

    this.waitForCondition(ExpectedConditions.stalenessOf(elementToActivate));
    log.debug("Element is now stale");
    this.waitForCondition((webdrv) -> {
      return READYSTATE_COMPLETE.equals(((JavascriptExecutor) webdrv).executeScript(READYSTATE_JS, new Object[0]));
    });
  }


  public void takePicture(String fileName) {
    try {
      WebDriver augmentedDriver = DRIVER;
      if (DRIVER instanceof RemoteWebDriver) {
        augmentedDriver = (new Augmenter()).augment(DRIVER);
      }

      String fullScreenshotsPath = screenshotsPath;

      File screenshotsDirectory = new File(fullScreenshotsPath);
      assert (screenshotsDirectory.exists() || (!screenshotsDirectory.exists() && screenshotsDirectory.mkdirs()));

      File screenshot = new File(fullScreenshotsPath + fileName.replaceAll("\\W+", "") + ".png");
      FileOutputStream out = new FileOutputStream(screenshot);

      out.write((byte[]) ((TakesScreenshot) augmentedDriver).getScreenshotAs(OutputType.BYTES));
      out.close();
    } catch (Exception ex) {
      log.error("Failed creating screenshot " + ex);
    }
  }


  protected void executeJavascript(String script) {
    if (DRIVER instanceof JavascriptExecutor) {
      ((JavascriptExecutor) DRIVER).executeScript(script);
    }
  }
}
