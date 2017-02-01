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
import com.gargoylesoftware.htmlunit.html.HtmlButtonInput;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2017-01-16
 */
public class ParkMobileDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(ParkMobileDataCollector.class);

  private final String collectorDisplayName = "ParkMobile";
  private final String collectorName = "park-mobile";

  private final String loginPageUrl = "https://nl.parkmobile.com/Epms/ClientPages/default.aspx";

  private final String userName = "epotters@xs4all.nl";
  private final String password = "V@l3nc1@";

  final int exportPeriodInMonths = 12;

  final String dateFormat = "d-M-yyyy";
  ;
  final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(dateFormat);

  private final WebClient webClient = new WebClient();


  public ParkMobileDataCollector() {

    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);
  }


  @Override
  public void collect() throws Exception {

    LOG.info("Logging in \"" + collectorDisplayName + "\"");

    final HtmlPage loginPage = webClient.getPage(loginPageUrl);
    LOG.debug("Login page loaded: " + loginPage.getTitleText());


    HtmlPage loginResultPage = login(loginPage);
    LOG.info("Logged in");
    getCurrentUser(loginResultPage);

    HtmlPage historyPage = navigateToHistory(loginResultPage);
    LOG.info("History found");

    downloadData(historyPage);
    LOG.info("History downloaded");

    webClient.close();
  }


  public HtmlPage login(HtmlPage loginPage) throws IOException {

    final String loginFormName = "aspnetForm";
    final String userNameFieldName = "ctl00$cphMain$UcUserLoginControl1$userName";
    final String passwordFieldName = "ctl00$cphMain$UcUserLoginControl1$password";
    final String loginButtonName = "ctl00$cphMain$UcUserLoginControl1$logOn";

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

    final HtmlButtonInput submitButton = (HtmlButtonInput) loginForm.getInputByName(loginButtonName);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();
    LOG.debug("After login, the first page title is: " + loginResultPage.getTitleText());

    LOG.info("Logged in successfully");
    return loginResultPage;
  }


  private HtmlPage navigateToHistory(HtmlPage firstPageAfterLogin) throws Exception {
    final String historyLinkText = "Parkeerhistorie";
    HtmlAnchor historyLink = firstPageAfterLogin.getAnchorByText(historyLinkText);
    assert (historyLink != null);
    return historyLink.click();
  }


  private void downloadData(HtmlPage historyPage) throws Exception {

    LOG.info("On the historypage titled " + historyPage.getTitleText());

    // Fill the search form
    final String searchFormName = "aspnetForm";
    final String startDateFieldName = "ctl00$cphMain$UcPermitParkingHistory1d$UcFilterSearch1$calPeriodStart$dateInput";
    final String endDateFieldName = "ctl00$cphMain$UcPermitParkingHistory1d$UcFilterSearch1$calPeriodEnd$dateInput";
    final String searchButtonId = "ctl00_cphMain_UcPermitParkingHistory1d_UcFilterSearch1_btnSearch";

    // Perform search
    final HtmlForm loginForm = historyPage.getFormByName(searchFormName);
    assert (loginForm != null);
    LOG.debug("Search form found");

    final LocalDate endDate = LocalDate.now();
    final LocalDate startDate = endDate.minusMonths(exportPeriodInMonths);

    final HtmlTextInput startDateField = loginForm.getInputByName(startDateFieldName);
    assert (startDateField != null);
    startDateField.setValueAttribute(startDate.format(dateFormatter));
    LOG.debug("startDateField set to " + startDateField.getValueAttribute());

    final HtmlTextInput endDateField = loginForm.getInputByName(endDateFieldName);
    assert (endDateField != null);
    endDateField.setValueAttribute(endDate.format(dateFormatter));
    LOG.debug("endDateField set to " + endDateField.getValueAttribute());

    final HtmlAnchor submitButton = (HtmlAnchor) historyPage.getElementById(searchButtonId);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    historyPage = submitButton.click();

    // Download results
    final String downloadLinkText = "Exporteren naar CSV";
    HtmlAnchor downloadLink = historyPage.getAnchorByText(downloadLinkText);
    assert (downloadLink != null);

    HtmlPage download = downloadLink.click();
    LOG.debug("The download is: " + download.asText());
  }


  private boolean getCurrentUser(HtmlPage page) {
    final String currentUserBoxId = "logged-user";
    DomElement currentUserBox = page.getElementById(currentUserBoxId);
    if (currentUserBox == null) {
      return false;
    } else {
      DomNodeList<HtmlElement> parts = currentUserBox.getElementsByTagName("em");
      String userDisplayName = parts.get(0).asText();
      String userName = parts.get(1).asText();
      LOG.debug("DisplayName: " + userDisplayName + ", User name: " + userName);
      return true;
    }
  }
}
