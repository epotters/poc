import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import java.util.List;

/**
 * Created by epotters on 2015-12-16
 */
public class MySecondSeleniumTest {

    private static final String URL = "https://mijn.ing.nl/internetbankieren/SesamLoginServlet";
    private static final WebDriver driver = new HtmlUnitDriver(true);
    private static final int SLEEP_DURATION = 100;


    public static void main(String[] args) {

        // And now use this to visit ING Telebankieren
        driver.get(URL);
        System.out.println("Page title is: " + driver.getTitle());

        try {
            Thread.sleep(30);
        } catch(Exception e) {

            System.out.println("Error while waiting for the page to load");
        }

        login("q9nt3qtg", "P@mpl0n@");


        System.out.println("After login, the page title is: " + driver.getTitle());


        // Link: https://bankieren.mijn.ing.nl/particulier/overzichten/download/index
        WebElement link = driver.findElement(By.linkText("Af- en bijschrijvingen downloaden"));
        link.click();


        System.out.println("Click link, the page title is: " + driver.getTitle());

        // Vul de velden: rekening startDate-input endDate-input downloadFormat


        // Klik op de knop Download
        WebElement downloadLink = driver.findElement(By.linkText("Download"));



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


    private static WebElement getFieldByParentElementId(String parentElementId) {
        WebElement parentEl = driver.findElement(By.id(parentElementId));
        return parentEl.findElement(By.tagName("input"));
    }
}

