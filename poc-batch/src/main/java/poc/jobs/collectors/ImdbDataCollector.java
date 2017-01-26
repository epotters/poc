package poc.jobs.collectors;


import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.TextPage;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2017-01-16
 */
public class ImdbDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(ImdbDataCollector.class);

  private final String collectorDisplayName = "IMDb Watchlist";
  private final String collectorName = "imdb-watchlist";

  private final String userName = "epotters@xs4all.nl";
  private final String password = "b1vidh";

  @Value("${collectors.output-path}")
  private String outputPath;
  private String collectorOutputPath;

  private final WebClient webClient = new WebClient();


  public ImdbDataCollector() {

    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);

  }


  @Override
  public void collect() throws IOException {
    LOG.debug("Logging in \"" + collectorDisplayName + "\"");

    HtmlPage loginPage = chooseLoginOption();
    HtmlPage loginResult = login(loginPage);
    HtmlPage watchlistPage = watchlist(loginResult);

    downloadWatchlist(watchlistPage);

    LOG.info("Logged in");
    webClient.close();

  }


  private HtmlPage chooseLoginOption() throws IOException {

    String loginPageUrl = "https://www.imdb.com/registration/signin";

    // Go to the login page
    LOG.debug("Loading login options page");
    HtmlPage signinOptionsPage = webClient.getPage(loginPageUrl);
    LOG.debug("Current page: " + signinOptionsPage.getTitleText());

    // Click on the button "Sign in with IMDB"
    DomElement signinOptionsList = signinOptionsPage.getElementById("signin-options");

    DomNodeList<HtmlElement> signinOptions = signinOptionsList.getElementsByTagName("a");

    HtmlPage loginPage = null;

    for (HtmlElement signinOption : signinOptions) {
      LOG.debug("Login option with href " + signinOption.getAttribute("href"));
      if (signinOption.getAttribute("href").startsWith("https://www.imdb.com/ap/signin")) {

        LOG.debug("Loginbutton found");
        loginPage = signinOption.click();
      }
    }
    assert (loginPage != null);
    LOG.info("Login page title: " + loginPage.getTitleText());

    return loginPage;
  }


  private HtmlPage login(HtmlPage loginPage) throws IOException {

    final String loginFormName = "signIn";
    final String userNameFieldName = "email";
    final String passwordFieldName = "password";

    final String loginButtonId = "signInSubmit";

    final HtmlForm loginForm = loginPage.getFormByName(loginFormName);
    assert (loginForm != null);
    LOG.debug("Login form found");

    final HtmlPasswordInput passwordField = loginForm.getInputByName(passwordFieldName);
    assert (passwordField != null);
    passwordField.setValueAttribute(password);
    LOG.debug("passwordField set");

    final HtmlTextInput userNameField = loginForm.getInputByName(userNameFieldName);
    assert (userNameField != null);
    userNameField.setValueAttribute(userName);
    LOG.debug("userNameField set" + userNameField);

    final HtmlSubmitInput submitButton = (HtmlSubmitInput) loginPage.getElementById(loginButtonId);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();

    LOG.debug("User name: " + userNameField.getValueAttribute());

    // Is there an error?
    DomElement errorBox = loginResultPage.getElementById("auth-error-message-box");
    LOG.debug("Error box content:\n" + errorBox.asText());
    LOG.debug("Login result page title is: " + loginResultPage.getTitleText());

    return loginResultPage;
  }


  private HtmlPage watchlist(HtmlPage firstPageAfterLogin) throws IOException {
    final String watchlistMenuLabel = "Watchlist";
    HtmlElement watchlistLink = firstPageAfterLogin.getAnchorByText(watchlistMenuLabel);
    assert (watchlistLink != null);
    return watchlistLink.click();
  }


  private void downloadWatchlist(HtmlPage watchlistPage) throws IOException {
    final String downloadLinkText = "Export this list";
    HtmlAnchor downloadLink = watchlistPage.getAnchorByText(downloadLinkText);
    TextPage downloadResult = downloadLink.click();

    LOG.debug(downloadResult.getContent());
  }

}



