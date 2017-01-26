package poc.jobs.collectors;


import java.io.IOException;
import java.io.InterruptedIOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.TextPage;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlOption;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlRadioButtonInput;
import com.gargoylesoftware.htmlunit.html.HtmlSelect;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;
import com.gargoylesoftware.htmlunit.javascript.background.JavaScriptJobManager;


/**
 * Created by eelko on 2017-01-16
 */
public class IngDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(IngDataCollector.class);

  private final String collectorDisplayName = "Mijn ING Transacties";
  private final String collectorName = "ing-transactions";

  // User account
  private final String userName = "q9nt3qtg";
  private final String password = "V@l3nc1@";

  @Value("${collectors.output-path}")
  private String outputPath;
  private String collectorOutputPath;

  private final int exportPeriodInMonths = 12;

  private final WebClient webClient = new WebClient();


  public IngDataCollector() {
    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);
  }


  @Override
  public void collect() throws Exception {
    LOG.debug("Logging in \"" + collectorDisplayName + "\"");

    /*
    try(webClient.close()) {

    }
    */

    HtmlPage loginResultPage = login();

    HtmlPage downloadPage = gotoDownloadPage(loginResultPage);

    HtmlPage downloadResultPage = downloadTransactions(downloadPage);

    assert (downloadResultPage != null);

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


  private HtmlPage downloadTransactions(HtmlPage downloadPage) throws Exception {

    LOG.debug("Download page title \"" + downloadPage.getTitleText() + "\"");

    if (waitForJavascriptToFinish(downloadPage)) {
      LOG.debug("Javascript finished on downloadpage");
    }

    // Fields
    final String accountFieldName = "accounts";
    final String startDateFieldId = "startDate-input";
    final String endDateFieldId = "endDate-input";
    final String fileFormatFieldId = "downloadFormat";

    final String downloadButtonText = "Download";

    final String dateFormat = "dd-MM-yyyy";

    // Values to set
    final String accountIban = "NL88 INGB 0000 8456 34";
    final String accountOptionToChooseId = "accounts-1";

    final LocalDate endDate = LocalDate.now();
    final LocalDate startDate = endDate.minusMonths(exportPeriodInMonths);

    final String fileFormatValue = "string:CSV";
    final String fileFormatLabel = "Kommagescheiden CSV";


    final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(dateFormat);



    int i = webClient.waitForBackgroundJavaScript(1000);




    // Select an account
    HtmlRadioButtonInput accountOptionToChoose = (HtmlRadioButtonInput) downloadPage.getElementById(accountOptionToChooseId);
    // accountOptionToChoose.click();

    // Set start date
    HtmlTextInput startDateField = (HtmlTextInput) downloadPage.getElementById(startDateFieldId);
    startDateField.setValueAttribute(startDate.format(dateFormatter));

    // Set end date
    HtmlTextInput endDateField = (HtmlTextInput) downloadPage.getElementById(endDateFieldId);
    endDateField.setValueAttribute(endDate.format(dateFormatter));

    // Select the file format
    HtmlSelect fileFormatField = (HtmlSelect) downloadPage.getElementById(fileFormatFieldId);

    LOG.debug("File formet field as XML:\n" + fileFormatField.asXml());
    HtmlOption optionToSelect = fileFormatField.getOptionByText(fileFormatLabel);
    assert (optionToSelect != null);
    fileFormatField.setSelectedAttribute(optionToSelect, true);

/*
    LOG.debug("File format field: " + fileFormatField.getTextContent());
    List<HtmlOption> options = fileFormatField.getOptions();
    LOG.debug("Found: " + options.size() + " options");
    HtmlOption optionToSelect = null;
    for (HtmlOption option : options) {
      LOG.debug("option.getValueAttribute: " + option.getValueAttribute());
      if (option.getValueAttribute().equals(fileFormat)) {
        optionToSelect = option;
        LOG.debug("Option to select found: " + option.getValueAttribute());
        break;
      }
    }
    assert (optionToSelect != null);
    fileFormatField.setSelectedAttribute(optionToSelect, true);
*/

    // <button class="btn btn-primary btn-medium " ng-click="download()">Download</button>
    List<DomElement> buttons = downloadPage.getElementsByName("button");
    LOG.debug("Found " + buttons.size() + " buttons on the page");
    DomElement downloadButton = null;
    for (DomElement button : buttons) {
      if (button.getTextContent().equals(downloadButtonText)) {
        downloadButton = button;
        break;
      }
    }
    assert (downloadButton != null);

    TextPage download = downloadButton.click();
    LOG.debug("The download is: " + download.toString());

    return null;
  }


  private boolean waitForJavascriptToFinish(HtmlPage page) throws Exception {
    int interval = 1000;
    int timeout = 15000;
    int i = 0;
    long startTime = System.currentTimeMillis();
    JavaScriptJobManager manager = page.getEnclosingWindow().getJobManager();
    while (manager.getJobCount() > 0) {
      LOG.debug("Starting sleep " + i++ + " (" + manager.getJobCount() + " Javascript jobs running");


      Thread.sleep(interval);
      if (System.currentTimeMillis() - startTime > timeout) {
        LOG.debug("Timeout occurred while waiting");
        manager.removeAllJobs();
        LOG.debug("All jobs removed");
        break;
        // throw new Exception("Timeout exceeded");
      }
    }
    return true;
  }

  private void setAccountSelector(HtmlPage downloadPage, String iban) throws IOException {

    final String accountsSelectorId = "accounts";
    DomElement accountsSelector = downloadPage.getElementById(accountsSelectorId);

    DomNodeList<HtmlElement> accountOptionElements = accountsSelector.getElementsByTagName("input");

    HtmlRadioButtonInput radioToSelect = null;

    for (HtmlElement accountOptionElement : accountOptionElements) {
      if (!accountOptionElement.getAttribute("type").equals("radio") && accountOptionElement.getAttribute("value").equals("")) {
        radioToSelect = (HtmlRadioButtonInput) accountOptionElement;
        break;
      }
    }

    assert (radioToSelect != null);

    radioToSelect.click();

  }


  private LocalDate findLastDownload() {
    final LocalDate today = LocalDate.now();
    return today.minusMonths(1);
  }

}
