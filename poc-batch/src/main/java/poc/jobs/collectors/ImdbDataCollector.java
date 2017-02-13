package poc.jobs.collectors;


import java.io.IOException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;


/**
 * Created by eelko on 2017-01-16
 */
public class ImdbDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(ImdbDataCollector.class);


  public ImdbDataCollector() {
    super(AccountType.IMDB);
  }


  public ImdbDataCollector(WebDriver driver) {
    super(AccountType.IMDB, driver);
  }


  @Override
  protected void init() {
    setCollectorName("imdb-watchlist");
    outputDirectory = createOutputDirectory();

    LOG.debug("Collector name: " + getCollectorName());
    LOG.debug("Output directory: " + outputDirectory.getPath());
  }


  @Override
  public void collect() throws Exception {

    try {

      login();
      LOG.debug("After login, the page title is \"" + driver.getTitle() + "\"");

      goToWatchlist();
      LOG.debug("After going to the watchlist, the page title is \" " + driver.getTitle() + "\"");

      downloadWatchlist();
      LOG.debug("After download, the page title is \"" + driver.getTitle() + "\"");

    }
    finally {
      driver.close();
    }
  }


  @Override
  public void login() throws Exception {

    LOG.debug("About to login to URL: " + getType().getLoginPageUrl());
    driver.get(getType().getLoginPageUrl());
    LOG.debug("After getting the login URL, the page title is \"" + driver.getTitle() + "\"");

    chooseLoginOption();
    LOG.debug("After login option choice, the page title is \"" + driver.getTitle() + "\"");

    submitLoginForm();
  }


  @Override
  public boolean isLoggedIn() throws Exception {
    return false;
  }


  @Override
  public void logout() {

  }


  private void chooseLoginOption() throws IOException {

    final String signinOptionsListId = "signin-options";
    final String baseUrl = "https://www.imdb.com/ap/signin";

    // Click on the button "Sign in with IMDB"
    List<WebElement> signinOptions = driver.findElements(By.cssSelector("#" + signinOptionsListId + " a"));
    LOG.debug(signinOptions.size() + " signinOptions found");

    for (WebElement signinOption : signinOptions) {
      LOG.debug("Login option with href " + signinOption.getAttribute("href"));
      if (signinOption.getAttribute("href").startsWith(baseUrl)) {
        LOG.debug("Loginbutton found");

        activateAndWaitForNewPage(signinOption);
        // signinOption.click();
        break;
      }
    }
    LOG.info("Login page title: " + driver.getTitle());
  }


  public void submitLoginForm() throws Exception {

    final String loginFormName = "signIn";
    final String userNameFieldName = "email";
    final String passwordFieldName = "password";

    final String loginButtonId = "signInSubmit";

    final WebElement loginForm = driver.findElement(By.name(loginFormName));
    assert (loginForm != null);
    LOG.debug("Login form found");

    final WebElement passwordField = loginForm.findElement(By.name(passwordFieldName));
    assert (passwordField != null);
    passwordField.sendKeys(getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement userNameField = loginForm.findElement(By.name(userNameFieldName));
    assert (userNameField != null);
    userNameField.sendKeys(getAccount().getPassword());
    LOG.debug("userNameField set" + userNameField);

    final WebElement submitButton = loginForm.findElement(By.id(loginButtonId));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    activateAndWaitForNewPage(submitButton);
    // submitButton.click();

    checkForErrors();

    LOG.debug("Login result page is titled: " + driver.getTitle());
  }


  private void goToWatchlist() throws IOException {
    final String watchlistMenuLabel = "Watchlist";
    WebElement watchlistLink = driver.findElement(By.linkText(watchlistMenuLabel));
    assert (watchlistLink != null);
    watchlistLink.click();
  }


  private void checkForErrors() {
    try {
      final WebElement errorBox = driver.findElement(By.id("auth-error-message-box"));
      LOG.debug("Error box content:\n" + errorBox.getText());
    }
    catch (Exception e) {
      LOG.debug("No error box found");
    }
  }


  private void downloadWatchlist() throws IOException {
    final String downloadLinkText = "Export this list";
    WebElement downloadLink = driver.findElement(By.linkText(downloadLinkText));
    downloadLink.click();
  }

}
