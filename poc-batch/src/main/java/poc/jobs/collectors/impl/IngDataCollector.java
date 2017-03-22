package poc.jobs.collectors.impl;


import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.gargoylesoftware.htmlunit.WebWindowEvent;

import poc.jobs.collectors.AccountType;
import poc.jobs.collectors.DataCollector;


/**
 * Created by eelko on 2017-01-16
 */
public class IngDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(IngDataCollector.class);

  private final int exportPeriodInMonths = 12;


  public IngDataCollector() {
    super(AccountType.ING);
  }


  public IngDataCollector(WebDriver driver) {
    super(AccountType.ING, driver);
  }


  @Override
  public void collect() throws Exception {

    try {

      login();

      assert (isLoggedIn());

      LOG.debug("Logged in");

      gotoDownloadPage();

      downloadTransactions();

    }
    finally {
      driver.close();
    }
  }


  @Override
  public void login() throws Exception {

    LOG.debug("Selenium versie");

    driver.get(getType().getLoginPageUrl());

    final String loginFormName = "login";
    final String userNameFieldContainerId = "gebruikersnaam";
    final String passwordFieldContainerId = "wachtwoord";

    LOG.debug("Login page loaded: " + driver.getTitle());

    final WebElement loginForm = driver.findElement(By.name(loginFormName));
    assert (loginForm != null);
    LOG.debug("Login form found");

    final WebElement userNameFieldContainer = driver.findElement(By.id(userNameFieldContainerId));
    final WebElement userNameField = userNameFieldContainer.findElement(By.tagName("input"));
    assert (userNameField != null);
    setFieldValueUsingJs(userNameField, getAccount().getUsername());
    LOG.debug("userNameField set");

    final WebElement passwordFieldContainer = driver.findElement(By.id(passwordFieldContainerId));
    final WebElement passwordField = passwordFieldContainer.findElement(By.tagName("input"));
    assert (passwordField != null);
    LOG.debug("Password field found");

    setFieldValueUsingJs(passwordField, getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.tagName("button"));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    // submitButton.click();
    activateAndWaitForNewPage(submitButton);

    LOG.debug("Login result page title is: " + driver.getTitle());

    // Check for error box
    WebElement errorBox = findErrorBox();
    assert (errorBox == null);
  }


  @Override
  public boolean isLoggedIn() throws Exception {
    final String cssSelector = "#riaf-identification-uid span strong";
    WebElement userDisplayNameElement = driver.findElement(By.cssSelector(cssSelector));
    assert (userDisplayNameElement != null);
    LOG.debug("UserAccount display name found " + userDisplayNameElement.getText());
    return (userDisplayNameElement.getText().equals(getAccount().getDisplayName()));
  }


  @Override
  public void logout() {
    final String cssSelector = "div.riaf-header-identification a.riaf-link";
    WebElement logoutButtonElement = driver.findElement(By.cssSelector(cssSelector));
    assert (logoutButtonElement != null);
    activateAndWaitForNewPage(logoutButtonElement);
  }


  // <div class="notification">...</div>
  private WebElement findErrorBox() {
    WebElement errorBox = null;
    List<WebElement> notifications = driver.findElements(By.cssSelector("div.notification"));
    if (notifications != null && notifications.size() > 0) {
      errorBox = notifications.get(0);
    }
    return errorBox;
  }


  private void gotoDownloadPage() throws IOException {

    final String iban = "NL48 INGB 0000 0969 32";
    // selectIban(iban);

    final String downloadLinkLabel = "Af- en bijschrijvingen downloaden";
    final WebElement downloadLink = driver.findElement(By.linkText(downloadLinkLabel));
    assert (downloadLink != null);
    activateAndWaitForNewPage(downloadLink);
  }


  private void downloadTransactions() throws Exception {

    LOG.debug("Download page title \"" + driver.getTitle() + "\"");

    // Fields
    final String startDateFieldId = "startDate-input";
    final String endDateFieldId = "endDate-input";

    final String downloadButtonText = "Download";
    final String dateFormat = "dd-MM-yyyy";

    // Values to set
    final String accountIban = "NL88 INGB 0000 8456 34";
    final String accountOptionToChooseId = "accounts-1";

    final LocalDate endDate = LocalDate.now();
    final LocalDate startDate = endDate.minusMonths(exportPeriodInMonths);

    final String fileFormatValue = "string:CSV";
    final String fileFormatLabel = "Kommagescheiden CSV";

    final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(dateFormat);

    // Select an account
    // selectAccount(accountOptionToChooseId);

    // Set start date
    final WebElement startDateField = driver.findElement(By.id(startDateFieldId));
    startDateField.sendKeys(startDate.format(dateFormatter));

    // Set end date
    final WebElement endDateField = driver.findElement(By.id(endDateFieldId));
    endDateField.sendKeys(endDate.format(dateFormatter));

    // Select the file format
    // selectFileFormat(fileFormatLabel);

    final WebElement downloadButton = driver.findElement(By.linkText(downloadButtonText));
    assert (downloadButton != null);

    activateAndWaitForNewPage(downloadButton);
  }


  private void selectAccount(String accountOptionToChooseId) {

    final String accountFieldId = "accounts";

    WebElement accountChooser = driver.findElement(By.id(accountFieldId));
    accountChooser.click();
    WebElement accountOptionToChoose = waitForElementPresence(accountOptionToChooseId);
    accountOptionToChoose.click();
  }


  private void selectFileFormat(String fileFormatLabel) {

    final String fileFormatFieldId = "downloadFormat";

    final WebElement fileFormatField = driver.findElement(By.id(fileFormatFieldId));
    fileFormatField.click();
    final WebElement optionToSelect = fileFormatField.findElement(By.linkText(fileFormatLabel));
    assert (optionToSelect != null);
    optionToSelect.click();
  }


  void webWindowContentChanged(WebWindowEvent event) throws IOException {

    InputStream is = event.getWebWindow().getEnclosedPage().getWebResponse().getContentAsStream();
  }


  private LocalDate findLastDownload() {
    final LocalDate today = LocalDate.now();
    return today.minusMonths(1);
  }


  // Select the account to download by its iban
  private WebElement selectIban(String iban) {

    final String accountsListId = "accounts";
    WebElement accountsList = driver.findElement(By.id(accountsListId));
    assert (accountsList != null);

    driver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);

    List<WebElement> accountElementList = accountsList.findElements(By.cssSelector("div.ng-binding"));
    LOG.debug("Found a list containing " + accountElementList.size() + " accounts");

    if (accountElementList.size() > 0) {
      LOG.debug("First account element " + accountElementList.get(0).getText());
    }

    WebElement elementToClick = null;
    for (WebElement accountElement : accountElementList) {
      LOG.debug("IBAN: " + accountElement.getText());
      if (accountElement.getText().equals(iban)) {
        elementToClick = accountElement;
        break;
      }
    }
    assert (elementToClick != null);
    return elementToClick;
  }
}
