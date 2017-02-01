package poc.jobs.collectors;


import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlRadioButtonInput;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2017-01-16
 */
public class OvChipkaartDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(OvChipkaartDataCollector.class);

  private final String collectorDisplayName = "OV Chipkaart";
  private final String collectorName = "ov-chipkaart";

  private final String loginPageUrl = "https://www.ov-chipkaart.nl/mijn-ov-chipkaart.htm";
  private final String userName = "epotters";
  private final String password = "kl00st3r4";



  public OvChipkaartDataCollector() {

    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);
  }


  @Override
  public void collect() throws Exception {
    LOG.debug("Logging in \"" + collectorDisplayName + "\"");

    try (WebClient webClient = new WebClient()) {

      final HtmlPage loginPage = webClient.getPage(loginPageUrl);
      LOG.debug("Login page loaded: " + loginPage.getTitleText());

      HtmlPage loginResultPage = login(loginPage);

      HtmlPage historyPage = goToHistory(loginResultPage);

      download(historyPage);

    }
  }

  @Override
  public HtmlPage login(HtmlPage loginPage) throws IOException {

    final String loginFormId = "login-form";
    final String userNameFieldName = "username";
    final String passwordFieldName = "password";
    final String loginFormButtonId = "btn-login";

    final HtmlForm loginForm = (HtmlForm) loginPage.getElementById(loginFormId);
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
    LOG.debug("After login, the first page title is: " + loginResultPage.getTitleText());

    // Check for error box
    DomElement errorBox = findErrorBox(loginPage);
    assert (errorBox == null);

    LOG.debug("Logged in successfully");
    return loginResultPage;
  }


  private HtmlPage goToHistory(HtmlPage loginResultPage) throws Exception {

    LOG.debug("Navigating to the history page");
    final String historyLinkText = "Bekijk OV-reishistorie";
    final HtmlAnchor historyLink = loginResultPage.getAnchorByText(historyLinkText);
    assert (historyLink != null);
    return historyLink.click();
  }


  private void download(HtmlPage historyPage) throws Exception {

    LOG.debug("Downloading data from history page (not implemented) \"" + historyPage.getTitleText() + "\"");

    historyPage = filterHistory(historyPage, LocalDate.now(), LocalDate.now().minusMonths(1));

    // Click Declaratieoverzicht maken

    // on the next page click download as csv

    // LOG.debug("Data downloaded");
  }


  private HtmlPage filterHistory(HtmlPage historyPage, LocalDate startDate, LocalDate endDate) throws Exception {

    final String dateFilterTypeIdToSelect = "dateFilter";
    final String dateRangeFieldId = "select-period";
    final String submitButtonId = "selected-card";

    HtmlRadioButtonInput dateFilterTypeField = (HtmlRadioButtonInput) historyPage.getElementById(dateFilterTypeIdToSelect);
    dateFilterTypeField.setChecked(true);

    // 02-01-2017 t/m 31-01-2017
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    String dateRangeValue = startDate.format(formatter) + " t/m " + endDate.format(formatter);

    HtmlTextInput dateRangeField = (HtmlTextInput) historyPage.getElementById(dateRangeFieldId);
    dateRangeField.setValueAttribute(dateRangeValue);

    HtmlSubmitInput submitButton = (HtmlSubmitInput) historyPage.getElementById(submitButtonId);
    assert (submitButton != null);

    return submitButton.click();
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
