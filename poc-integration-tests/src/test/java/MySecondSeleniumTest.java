import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;


/**
 * Created by epotters on 2015-12-16
 */
public class MySecondSeleniumTest {

  private static final WebDriver driver = new HtmlUnitDriver(true);

  private static final String URL = "https://mijn.ing.nl/internetbankieren/SesamLoginServlet";
  private static final int SLEEP_DURATION = 120;

  private static final String USERNAME = "q9nt3qtg";
  private static final String PASSWORD = "P@mpl0n@";


  public static void main(String[] args) {

    driver.get(URL);

    try {
      Thread.sleep(SLEEP_DURATION);
      System.out.println("Waking up after sleep");
    }
    catch (Exception e) {

      System.out.println("Error while waiting for the page to load");
    }

    System.out.println("On login page: " + driver.getTitle());

    Assert.assertEquals("Not on login page", "Inloggen Mijn ING", driver.getTitle());
    login(USERNAME, PASSWORD);

    System.out.println("After login, the page title is: " + driver.getTitle());

    // Link: https://bankieren.mijn.ing.nl/particulier/overzichten/download/index
    WebElement link = driver.findElement(By.linkText("Af- en bijschrijvingen downloaden"));
    link.click();

    // download();

    // System.out.println("Click link, the page title is: " + driver.getTitle());

    driver.quit();
  }


  private static void login(String username, String password) {

    WebElement loginFormEl = driver.findElement(By.id("login"));
    System.out.println("Login form action: " + loginFormEl.getAttribute("action"));

    WebElement usernameField = getFieldByParentElementId("gebruikersnaam");
    System.out.println("Input with id: " + usernameField.getAttribute("id") + ", visible?: " + usernameField.isDisplayed());

    WebElement passwordField = getFieldByParentElementId("wachtwoord");
    System.out.println("Input with id: " + passwordField.getAttribute("id") + ", visible?: " + passwordField.isDisplayed());

    usernameField.sendKeys(username);
    passwordField.sendKeys(password);

    loginFormEl.submit();

  }


  private static void download() {
    // Vul de velden: rekening startDate-input endDate-input downloadFormat
    WebElement downloadFormEl = driver.findElement(By.id("login"));

    WebElement startDateFormEl = driver.findElement(By.id("startDate-input"));
    startDateFormEl.sendKeys("01-01-2015");
    WebElement endDateFormEl = driver.findElement(By.id("endDate-input"));
    endDateFormEl.sendKeys("21-12-2015");
    WebElement downloadFormatFormEl = driver.findElement(By.id("downloadFormat"));
    downloadFormatFormEl.sendKeys("0"); // <option value="0">Kommagescheiden IBAN (jjjjmmdd)</option>

    // Klik op de knop Download
    WebElement downloadLink = driver.findElement(By.linkText("Download"));
    downloadLink.click();

    WebElement notification = driver.findElement(By.id("notification"));
    notification.isDisplayed();

  }


  private static WebElement getFieldByParentElementId(String parentElementId) {
    WebElement parentEl = driver.findElement(By.id(parentElementId));
    return parentEl.findElement(By.tagName("input"));
  }
}

