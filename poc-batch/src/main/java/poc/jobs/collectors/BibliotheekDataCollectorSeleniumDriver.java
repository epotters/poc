package poc.jobs.collectors;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;


/**
 * Created by eelko on 2015-02-14
 */
public class BibliotheekDataCollectorSeleniumDriver {

  private static final Log LOG = LogFactory.getLog(BibliotheekDataCollectorSeleniumDriver.class);

  private static String SOURCE_NAME = "Bibliotheek";

  private HtmlUnitDriver driver = new HtmlUnitDriver(true);


  public BibliotheekDataCollectorSeleniumDriver() {
    init();
  }


  private void init() {

  }


  public void collect() {
    LOG.debug("Logging in \"" + SOURCE_NAME + "\"");
    login();
    LOG.debug("Logged in \"" + SOURCE_NAME + "\"");
    driver.quit();
  }


  private void login() {

    String loginPageUrl = "http://www.utrechtcat.nl/cgi-bin/bx.pl?event=private&groepfx=10&vestnr=9990";
    String userName = "20105031598124";
    String password = "B@rb3r10";

    String userNameFieldId = "newlener";
    String passwordFieldId = "pinkode";

    driver.get(loginPageUrl);

    LOG.debug("Login page loaded, now find the login fields and set username and password");

    WebElement userNameField = driver.findElement(By.name(userNameFieldId));
    userNameField.sendKeys(userName);

    WebElement passwordField = driver.findElement(By.name(passwordFieldId));
    passwordField.sendKeys(password);

    LOG.debug("Fields set, ready to submit");

    // Now submit the form. WebDriver will find the form for us from the element
    passwordField.submit();

    LOG.debug("Page title is: " + driver.getTitle());
    LOG.debug("Page URL is: " + driver.getCurrentUrl());
  }
}
