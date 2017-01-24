package poc.jobs.collectors;


import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2017-01-16
 */
public class OvChipkaartDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(OvChipkaartDataCollector.class);

  private final String collectorDisplayName = "OV Chipkaart";
  private final String collectorName = "ov-chipkaart";

  final String userName = "epotters";
  final String password = "b1vidh";

  @Value("${collectors.output-path}")
  private String outputPath;
  private String collectorOutputPath;

  private final WebClient webClient = new WebClient();


  public OvChipkaartDataCollector() {

    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);
  }


  @Override
  public void collect() throws IOException {
    LOG.debug("Logging in \"" + collectorDisplayName + "\"");
    HtmlPage loginResultPage = login();

    webClient.close();
  }


  private HtmlPage login() throws IOException {

    final String loginPageUrl = "https://www.ov-chipkaart.nl/mijn-ov-chipkaart.htm";
    final String loginFormName = "login-form";
    final String userNameFieldName = "username";
    final String passwordFieldName = "password";
    final String loginFormButtonId = "btn_login";

    final HtmlPage loginPage = webClient.getPage(loginPageUrl);
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

    final HtmlSubmitInput submitButton = (HtmlSubmitInput) loginPage.getElementById(loginFormButtonId);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();
    LOG.debug("Page title is: " + loginResultPage.getTitleText());

    // Check for error box
    DomElement errorBox = findErrorBox(loginPage);
    assert (errorBox == null);

    return loginResultPage;
  }


  // <div class="alert alert-info"></div>
  private DomElement findErrorBox(HtmlPage loginPage) {
    DomNodeList<DomElement> divs = loginPage.getElementsByTagName("div");
    DomElement errorBox = null;
    for (DomElement div : divs) {
      if (div.getAttribute("class").equals("alert-info")) {
        errorBox = div;
        LOG.debug("Error on page:\n" + errorBox.asText());
        break;
      }
    }
    return errorBox;
  }

}
