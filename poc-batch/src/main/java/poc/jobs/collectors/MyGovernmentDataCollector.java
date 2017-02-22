package poc.jobs.collectors;


import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


/**
 * Created by eelko on 2017-01-16
 */
public class MyGovernmentDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(MyGovernmentDataCollector.class);


  public MyGovernmentDataCollector() {
    super(AccountType.MY_GOVERNMENT);
  }


  public MyGovernmentDataCollector(WebDriver driver) {
    super(AccountType.MY_GOVERNMENT, driver);
  }


  @Override
  public void collect() throws Exception {

    try {

      login();
      assert (isLoggedIn());
      LOG.debug("Logged in");

    }
    finally {
      driver.close();
    }
  }


  @Override
  public void login() throws Exception {

    LOG.debug("First page URL " + getType().getLoginPageUrl());

    // Navigate to the DigiD login page
    String loginButtonCssSelector = "a[title=Inloggen]";
    driver.get(getType().getLoginPageUrl());
    final WebElement loginButton = (new WebDriverWait(driver, getDriverWaitTimeOutSecs()))
        .until(ExpectedConditions.elementToBeClickable(By.cssSelector(loginButtonCssSelector)));
    assert(loginButton != null);
    LOG.debug("Page title (homepage) " + driver.getTitle());

    // activateAndWaitForNewPage(loginButton);

    loginButton.click();



    final String loginFormId = "new_authentication";
    final String userNameFieldId = "authentication_digid_username";
    final String passwordFieldId = "authentication_wachtwoord";

    final WebElement loginForm = (new WebDriverWait(driver, getDriverWaitTimeOutSecs()))
        .until(ExpectedConditions.presenceOfElementLocated(By.id(loginFormId)));
    assert (loginForm != null);
    LOG.debug("Login form found");

    final WebElement userNameField = loginForm.findElement(By.id(userNameFieldId));
    assert (userNameField != null);
    userNameField.sendKeys(getAccount().getUsername());
    LOG.debug("userNameField set");

    final WebElement passwordField = loginForm.findElement(By.id(passwordFieldId));
    assert (passwordField != null);
    LOG.debug("Password field found");
    passwordField.sendKeys(getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.name("commit"));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    activateAndWaitForNewPage(submitButton);
    LOG.debug("Login result page title is: " + driver.getTitle());

    // Check for error box
    WebElement errorBox = findErrorBox();
    assert (errorBox == null);
  }


  @Override
  public boolean isLoggedIn() throws Exception {
    final String cssSelector = "div.card--account span.card__content";
    WebElement userDisplayNameElement = driver.findElement(By.cssSelector(cssSelector));
    assert (userDisplayNameElement != null);
    LOG.debug("UserAccount display name found " + userDisplayNameElement.getText());
    return (userDisplayNameElement.getText().trim().equals(getAccount().getDisplayName()));
  }


  @Override
  public void logout() {
    final String cssSelector = "a[title='Uitloggen']";
    WebElement logoutButtonElement = driver.findElement(By.cssSelector(cssSelector));
    assert (logoutButtonElement != null);
    activateAndWaitForNewPage(logoutButtonElement);
  }


  private WebElement findErrorBox() {
    WebElement errorBox = null;
    List<WebElement> notifications = driver.findElements(By.cssSelector("div.block-with-icon--error"));
    if (notifications != null && notifications.size() > 0) {
      errorBox = notifications.get(0);
    }
    return errorBox;
  }

}
