package poc.jobs.collectors;


import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.gargoylesoftware.htmlunit.WebClient;


/**
 * Created by eelko on 2017-01-16
 */
public class ParkMobileDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(ParkMobileDataCollector.class);


  final int exportPeriodInMonths = 12;
  final String dateFormat = "d-M-yyyy";
  final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(dateFormat);



  public ParkMobileDataCollector() {
    super(AccountType.PARK_MOBILE);
  }


  public ParkMobileDataCollector(WebDriver driver) {
    super(AccountType.PARK_MOBILE, driver);
  }

  @Override
  protected void init() {

    setCollectorName("park-mobile");
    outputDirectory = createOutputDirectory();
    LOG.debug("Output directory: " + outputDirectory.getPath());
  }


  @Override
  public void collect() throws Exception {

    try {

      LOG.info("Logging in \"" + getType().getDisplayName() + "\"");


      login();

      LOG.info("Logged in");
      getCurrentUser();

      navigateToHistory();
      LOG.info("History found");

      downloadData();
      LOG.info("History downloaded");

    }
    finally {
      driver.close();
    }

  }


  public void login() throws IOException {

    driver.get(getType().getLoginPageUrl());
    LOG.debug("Login page loaded: " + driver.getTitle());

    final String loginFormName = "aspnetForm";
    final String userNameFieldName = "ctl00$cphMain$UcUserLoginControl1$userName";
    final String passwordFieldName = "ctl00$cphMain$UcUserLoginControl1$password";
    final String loginButtonName = "ctl00$cphMain$UcUserLoginControl1$logOn";

    final WebElement loginForm = driver.findElement(By.name(loginFormName));
    assert (loginForm != null);
    LOG.debug("Login form found");

    final WebElement userNameField = loginForm.findElement(By.name(userNameFieldName));
    assert (userNameField != null);
    userNameField.sendKeys(getAccount().getUsername());
    LOG.debug("userNameField set");

    final WebElement passwordField = loginForm.findElement(By.name(passwordFieldName));
    assert (passwordField != null);
    passwordField.sendKeys(getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.name(loginButtonName));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    submitButton.click();
    LOG.debug("After login, the first page title is: " + driver.getTitle());

    LOG.info("Logged in successfully");
  }


  @Override
  public boolean isLoggedIn() throws Exception {
    return false;
  }


  @Override
  public void logout() {

  }


  private void navigateToHistory() throws Exception {
    final String historyLinkText = "Parkeerhistorie";
    WebElement historyLink = driver.findElement(By.linkText(historyLinkText));
    assert (historyLink != null);
    historyLink.click();
  }


  private void downloadData() throws Exception {

    LOG.info("On the historypage titled " + driver.getTitle());

    // Fill the search form
    final String searchFormName = "aspnetForm";
    final String startDateFieldName = "ctl00$cphMain$UcPermitParkingHistory1d$UcFilterSearch1$calPeriodStart$dateInput";
    final String endDateFieldName = "ctl00$cphMain$UcPermitParkingHistory1d$UcFilterSearch1$calPeriodEnd$dateInput";
    final String searchButtonId = "ctl00_cphMain_UcPermitParkingHistory1d_UcFilterSearch1_btnSearch";

    // Perform search
    final WebElement loginForm = driver.findElement(By.name(searchFormName));
    assert (loginForm != null);
    LOG.debug("Search form found");

    final LocalDate endDate = LocalDate.now();
    final LocalDate startDate = endDate.minusMonths(exportPeriodInMonths);

    final WebElement startDateField = loginForm.findElement(By.name(startDateFieldName));
    assert (startDateField != null);
    startDateField.sendKeys(startDate.format(dateFormatter));
    LOG.debug("startDateField set to " + startDateField.getAttribute("value"));

    final WebElement endDateField = loginForm.findElement(By.name(endDateFieldName));
    assert (endDateField != null);
    endDateField.sendKeys(endDate.format(dateFormatter));
    LOG.debug("endDateField set to " + endDateField.getAttribute("value"));

    final WebElement submitButton = loginForm.findElement(By.id(searchButtonId));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    submitButton.click();

    // Download results
    final String downloadLinkText = "Exporteren naar CSV";
    WebElement downloadLink = driver.findElement(By.linkText(downloadLinkText));
    assert (downloadLink != null);

    downloadLink.click();
  }


  private boolean getCurrentUser() {
    final String currentUserBoxId = "logged-user";
    final WebElement currentUserBox = driver.findElement(By.id(currentUserBoxId));
    if (currentUserBox == null) {
      return false;
    }
    else {
      List<WebElement> parts = currentUserBox.findElements(By.tagName("em"));
      String userDisplayName = parts.get(0).getText();
      String userName = parts.get(1).getText();
      LOG.debug("DisplayName: " + userDisplayName + ", UserAccount name: " + userName);
      return true;
    }
  }
}
