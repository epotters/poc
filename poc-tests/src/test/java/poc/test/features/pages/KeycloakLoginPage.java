package poc.test.features.pages;


import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static poc.test.features.DriverHooks.DRIVER;


@Slf4j
public class KeycloakLoginPage extends BasePage {


  private String host = "keycloak.localhost.lab";
  private String realm = "EPO";
  private String pageTitle = "Log in to " + realm + " Realm";


  public boolean verifyPage() {
    return (DRIVER.getTitle().equals(pageTitle)) &
        (DRIVER.getCurrentUrl().contains(host));
  }


  public void login(String username, String password) throws Exception {

    final String loginFormId = "kc-form-login";
    final String usernameFieldId = "username";
    final String passwordFieldId = "password";
    final String loginButtonId = "kc-login";

    final WebElement loginForm = (new WebDriverWait(DRIVER, getDriverWaitTimeOutSecs()))
        .until(ExpectedConditions.elementToBeClickable(By.id(loginFormId)));
    assert (loginForm != null);
    log.debug("Login form found");

    final WebElement usernameField = loginForm.findElement(By.id(usernameFieldId));
    assert (usernameField != null);
    usernameField.sendKeys(username);
    log.debug("UsernameField set" + usernameField);

    final WebElement passwordField = loginForm.findElement(By.id(passwordFieldId));
    assert (passwordField != null);
    passwordField.sendKeys(password);
    log.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.id(loginButtonId));
    assert (submitButton != null);
    log.debug("Fields set, ready to submit");

    activateAndWaitForNewPage(submitButton);

    checkForErrors();

    log.debug("Login result page is titled: " + DRIVER.getTitle());
  }


  private void checkForErrors() {
    try {
      final WebElement errorBox = DRIVER.findElement(By.id("auth-error-message-box"));
      log.debug("Error box content:\n" + errorBox.getText());
    } catch (Exception e) {
      log.debug("No error box found");
    }
  }


}
