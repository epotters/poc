package poc.jobs.bibliotheek;


import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;


/**
 * Created by eelko on 14-02-2015.
 */
public class DataCollector {

  private static String SOURCE_NAME = "Bibliotheek";

  private HtmlUnitDriver driver;


  public DataCollector() {
    init();
  }


  public static void main(String args[]) {

    DataCollector collector = new DataCollector();

    collector.collect();
  }


  private void init() {

    driver = new HtmlUnitDriver(true);
    driver.setJavascriptEnabled(true);

  }


  public void collect() {
    System.out.println("Logging in " + SOURCE_NAME);
    login();
    driver.quit();
  }


  private void login() {
    // String url = "http://www.bibliotheekutrecht.nl/mijn-menu.html";
    String url = "http://www.utrechtcat.nl/cgi-bin/bx.pl?event=private&groepfx=10&vestnr=9990";
    String userName = "20105031598124";
    String password = "2611";

    String userNameFieldName = "newlener";
    String passwordFieldName = "pinkode";

    driver.get(url);

    System.out.println("Find the login fields and set username and password");

    WebElement userNameField = driver.findElement(By.name(userNameFieldName));
    userNameField.sendKeys(userName);

    WebElement passwordField = driver.findElement(By.name(passwordFieldName));
    passwordField.sendKeys(password);

    System.out.println("Fields set, ready to submit");

    // Now submit the form. WebDriver will find the form for us from the element
    passwordField.submit();

    System.out.println("Page title is: " + driver.getTitle());
    System.out.println("Page URL is: " + driver.getCurrentUrl());

  }

}
