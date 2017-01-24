package poc.jobs.collectors;


import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2017-01-16
 */
public class IngDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(IngDataCollector.class);

  private final String collectorDisplayName = "Mijn ING Transacties";
  private final String collectorName = "ing-transactions";

  // User account
  final String userName = "q9nt3qtg";
  final String password = "V@l3nc1@";


  @Value("${collectors.output-path}")
  private String outputPath;
  private String collectorOutputPath;

  private final WebClient webClient = new WebClient();


  public IngDataCollector() {
    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);
  }


  @Override
  public void collect() throws IOException {
    LOG.debug("Logging in \"" + collectorDisplayName + "\"");

    HtmlPage loginResultPage = login();

    HtmlPage downloadPage = gotoDownloadPage(loginResultPage);

    HtmlPage downloadResultPage = downloadTransactions(downloadPage);

    assert(downloadResultPage != null);

    LOG.debug("Download result \"" + downloadResultPage.asText() + "\"");

    webClient.close();
  }


  private HtmlPage login() throws IOException {

    final String loginPageUrl = "https://mijn.ing.nl";

    final String loginFormName = "login";

    final String userNameFieldContainerId = "gebruikersnaam";
    final String passwordFieldContainerId = "wachtwoord";

    final HtmlPage loginPage = webClient.getPage(loginPageUrl);

    LOG.debug("Login page loaded: " + loginPage.getTitleText());

    final HtmlForm loginForm = loginPage.getFormByName(loginFormName);
    assert (loginForm != null);
    LOG.debug("Login form found");

    final DomElement userNameFieldContainer = loginPage.getElementById(userNameFieldContainerId);

    final HtmlTextInput userNameField = (HtmlTextInput) userNameFieldContainer.getElementsByTagName("input").get(0);
    assert (userNameField != null);
    userNameField.setValueAttribute(userName);
    LOG.debug("userNameField set");

    final DomElement passwordFieldContainer = loginPage.getElementById(passwordFieldContainerId);
    final HtmlPasswordInput passwordField = (HtmlPasswordInput) passwordFieldContainer.getElementsByTagName("input").get(0);
    assert (passwordField != null);
    passwordField.setValueAttribute(password);
    LOG.debug("passwordField set");

    final HtmlButton submitButton = (HtmlButton) loginForm.getElementsByTagName("button").get(0);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();
    LOG.debug("Login result page title is: " + loginResultPage.getTitleText());

    // Check for error box
    DomElement errorBox = findErrorBox(loginPage);
    assert (errorBox == null);

    return loginResultPage;
  }


  // <div class="notification">...</div>
  private DomElement findErrorBox(HtmlPage loginPage) {
    DomNodeList<DomElement> divs = loginPage.getElementsByTagName("div");
    DomElement errorBox = null;
    for (DomElement div : divs) {
      if (div.getAttribute("class").equals("notification")) {
        errorBox = div;
        LOG.debug("Error on page:\n" + errorBox.asText());
        break;
      }
    }
    return errorBox;
  }

  // <a href="/particulier/overzichten/download/index">Af- en bijschrijvingen downloaden</a>
  private HtmlPage gotoDownloadPage(HtmlPage loginResultPage) throws IOException {
    final String downloadLinkLabel = "Af- en bijschrijvingen downloaden";
    DomElement downloadLink = loginResultPage.getAnchorByText(downloadLinkLabel);
    assert (downloadLink != null);
    return downloadLink.click();
  }



  private HtmlPage downloadTransactions(HtmlPage downloadPage) throws IOException {

    LOG.debug("Download page title " + downloadPage.getTitleText());
    LOG.debug("Download transactions is not implemented at this moment");

    return null;
  }

}
