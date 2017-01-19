package poc.jobs.bibliotheek;


import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * Created by eelko on 2017-01-16
 */
public class ImdbDataCollector {

  private static final Log LOG = LogFactory.getLog(ImdbDataCollector.class);

  private static String SOURCE_NAME = "IMDB Watchlist";

  private final WebClient webClient = new WebClient();


  public ImdbDataCollector() {
    init();
  }


  private void init() {

  }


  public void collect() throws IOException {
    LOG.debug("Logging in \"" + SOURCE_NAME + "\"");
    login();
    webClient.close();

  }


  private void login() throws IOException {

    String loginPageUrl = "https://www.imdb.com/registration/signin";
    String userName = "epotters@xs4all.nl";
    String password = "b1vidh";

    String userNameFieldId = "ap_email";
    String passwordFieldId = "ap_password";

    // Go to the login page
    LOG.debug("Loading login page");
    HtmlPage loginPage = webClient.getPage(loginPageUrl);
    LOG.debug("Current page: " + loginPage.getTitleText());

    /*
    // Click on the button "Sign in with IMDB"
    String cssSelector = "#signin-options div.list-group a[href^='https://www.imdb.com']";
    WebDriverWait wait = new WebDriverWait(driver, 10);
    wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
    WebElement signinWithImdbButton = driver.findElement(By.cssSelector(cssSelector));
    LOG.debug("signinWithImdbButton: " + signinWithImdbButton);

    signinWithImdbButton.click();
    LOG.debug("Current page: " + driver.getTitle());

    LOG.debug("Find the login fields and set username and password");
    WebElement userNameField = driver.findElement(By.id(userNameFieldId));
    userNameField.sendKeys(userName);
    WebElement passwordField = driver.findElement(By.id(passwordFieldId));
    passwordField.sendKeys(password);
    LOG.debug("Fields set, ready to submit");

    // Now submit the form. WebDriver will find the form for us from the element
    passwordField.submit();

    LOG.debug("Page title is: " + driver.getTitle());
    LOG.debug("Page URL is: " + driver.getCurrentUrl());
    */
  }


  /*
  private void mergeThis() {

    LOG.debug("Login page loaded: " + loginPage.getTitleText());

    final HtmlForm loginForm = loginPage.getFormByName(loginFormName);
    assert (loginForm != null);
    LOG.debug("Login form found");

    final HtmlTextInput userNameField = loginForm.getInputByName(userNameFieldName);
    assert (userNameField != null);
    userNameField.setValueAttribute(userName);
    LOG.debug("userNameField set");

    final HtmlPasswordInput passwordField = loginForm.getInputByName(passwordFieldName);
    assert (passwordField != null);
    passwordField.setValueAttribute(password);
    LOG.debug("passwordField set");

    final HtmlSubmitInput submitButton = loginForm.getInputByName(loginFormButtonName);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();
    LOG.debug("Page title is: " + loginResultPage.getTitleText());
    return loginResultPage;

  }
  */

}



