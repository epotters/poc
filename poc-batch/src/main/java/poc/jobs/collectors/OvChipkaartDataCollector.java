package poc.jobs.collectors;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
public class OvChipkaartDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(OvChipkaartDataCollector.class);


  public OvChipkaartDataCollector() {
    super(AccountType.OV_CHIPCARD);
  }


  public OvChipkaartDataCollector(WebDriver driver) {
    super(AccountType.OV_CHIPCARD, driver);
  }


  @Override
  public void collect() throws Exception {
    LOG.debug("Logging in \"" + getType().getDisplayName() + "\"");

    try {

      login();

      navigateToHistory();

      download();

    }
    finally {
      driver.close();
    }
  }


  @Override
  public void login() throws Exception {

    final String loginFormId = "login-form";
    final String userNameFieldName = "username";
    final String passwordFieldName = "password";
    final String loginFormButtonId = "btn-login";

    LOG.debug("About to load login page " + getType().getLoginPageUrl());
    driver.get(getType().getLoginPageUrl());

    final WebElement loginForm = (new WebDriverWait(driver, getDriverWaitTimeOutSecs()))
        .until(ExpectedConditions.presenceOfElementLocated(By.id(loginFormId)));

    LOG.debug("Login page is titled " + driver.getTitle());
    LOG.debug("Login form found, ready to log in");

    final WebElement userNameField = loginForm.findElement(By.name(userNameFieldName));
    assert (userNameField != null);
    userNameField.sendKeys(getAccount().getUsername());
    LOG.debug("userNameField set");

    final WebElement passwordField = loginForm.findElement(By.name(passwordFieldName));
    assert (passwordField != null);
    passwordField.sendKeys(getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.id(loginFormButtonId));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    activateAndWaitForNewPage(submitButton);
    LOG.debug("After login, the first page title is: " + driver.getTitle());

    // Check for error box
    WebElement errorBox = findErrorBox();
    assert (errorBox == null);

    assert (isLoggedIn());
    LOG.debug("Logged in successfully");
  }


  @Override
  public boolean isLoggedIn() {
    String loggedInUserCss = ".banner nav.global ul li";
    WebElement loggedInUserElement = driver.findElements(By.cssSelector(loggedInUserCss)).get(1);
    LOG.debug("loggedInUserElement: " + loggedInUserElement.getText());
    return (loggedInUserElement != null && loggedInUserElement.getText().contains(getAccount().getDisplayName()));
  }


  @Override
  public void logout() {


    String menuItemCssSelector = "div.user label.label";
    WebElement menuLink = driver.findElements(By.cssSelector(menuItemCssSelector)).get(0);
    menuLink.click();

    String logoutLinkCssSelector = "div.popup-content a.login";
    WebElement logoutLink = driver.findElements(By.cssSelector(logoutLinkCssSelector)).get(0);
    activateAndWaitForNewPage(logoutLink);
    assert (!isLoggedIn());
    LOG.debug("Logout page is titled " + driver.getTitle());
  }


  private void navigateToHistory() throws Exception {
    LOG.debug("Navigating to the history page");
    final String historyLinkText = "Bekijk OV-reishistorie";
    final WebElement historyLink = driver.findElement(By.linkText(historyLinkText));
    assert (historyLink != null);
    historyLink.click();
  }


  private void download() throws Exception {

    LOG.debug("Downloading data from history page (not implemented) \"" + driver.getTitle() + "\"");

    filterHistory(LocalDate.now(), LocalDate.now().minusMonths(1));

    // Click Declaratieoverzicht maken

    // on the next page click download as csv

    // LOG.debug("Data downloaded");
  }


  private void filterHistory(LocalDate startDate, LocalDate endDate) throws Exception {

    final String dateFilterTypeIdToSelect = "dateFilter";
    final String dateRangeFieldId = "select-period";
    final String submitButtonId = "selected-card";

    WebElement dateFilterTypeField = driver.findElement(By.id(dateFilterTypeIdToSelect));
    dateFilterTypeField.click();

    // 02-01-2017 t/m 31-01-2017
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    String dateRangeValue = startDate.format(formatter) + " t/m " + endDate.format(formatter);

    WebElement dateRangeField = driver.findElement(By.id(dateRangeFieldId));
    dateRangeField.sendKeys(dateRangeValue);

    WebElement submitButton = driver.findElement(By.id(submitButtonId));
    assert (submitButton != null);

    submitButton.click();
  }


  // <div class="alert alert-info"></div>
  private WebElement findErrorBox() {
    WebElement errorBox = null;
    try {
      errorBox = driver.findElement(By.cssSelector("div.alert-info"));
      LOG.debug("Error on page:\n" + errorBox.getText());
    } catch(Exception e) {

      LOG.debug("Error finding error box, assuming there is none");
    }
    return errorBox;
  }

}
