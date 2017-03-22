package poc.jobs.collectors.impl;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import poc.jobs.collectors.AccountType;
import poc.jobs.collectors.DataCollector;


/**
 * Created by eelko on 2015-02-14
 */
public class PublicLibraryDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(PublicLibraryDataCollector.class);

  private static final String SEP = " - ";
  private final String baseUrl = "http://www.utrechtcat.nl";

  private final int numberOfBooksPerPage = 50;
  private final int coverImageSize = 900;
  private final boolean collectingDetailsEnabled = false;
  private final boolean downloadingCoverImagesEnabled = false;
  private final String imagesParentPath = "/images";


  public PublicLibraryDataCollector() {
    super(AccountType.PUBLIC_LIBRARY);
  }


  public PublicLibraryDataCollector(WebDriver driver) {
    super(AccountType.PUBLIC_LIBRARY, driver);
  }


  @Override
  protected void init() {
    super.init();

    File imagesParent = new File(outputDirectory.getPath() + imagesParentPath);
    if (!imagesParent.exists() && imagesParent.mkdirs()) {
      LOG.debug("Images directory created");
    }
  }


  @Override
  public void collect() throws IOException {
    try {

      login();
      LOG.debug("Logged in \"" + getType().getDisplayName() + "\"");

      navigateToHistoryPage();
      LOG.debug("On history page");

      final List<WebElement> bookElements = collectHistory();
      LOG.debug("Collected " + bookElements.size() + " books");
    }
    finally {
      driver.close();
    }
  }


  @Override
  public void login() {

    final String loginFormName = "loginform";
    final String loginFormButtonName = "lener_knop";
    final String userNameFieldName = "newlener";
    final String passwordFieldName = "pinkode";

    driver.get(getType().getLoginPageUrl());

    final WebElement loginForm = (new WebDriverWait(driver, getDriverWaitTimeOutSecs()))
        .until(ExpectedConditions.elementToBeClickable(By.name(loginFormName)));
    assert (loginForm != null);
    LOG.debug("Login form found");

    LOG.debug("Login page loaded: " + driver.getTitle());
    LOG.debug("Logging in \"" + getType().getDisplayName() + "\"");

    final WebElement userNameField = loginForm.findElement(By.name(userNameFieldName));
    assert (userNameField != null);
    userNameField.sendKeys(getAccount().getUsername());
    LOG.debug("userNameField set");

    final WebElement passwordField = loginForm.findElement(By.name(passwordFieldName));
    assert (passwordField != null);
    passwordField.sendKeys(getAccount().getPassword());
    LOG.debug("passwordField set");

    final WebElement submitButton = loginForm.findElement(By.name(loginFormButtonName));
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    activateAndWaitForNewPage(submitButton);
    LOG.debug("After login, the page title is: " + driver.getTitle());

  }


  @Override
  public boolean isLoggedIn() {
    String loggedInUserCss = "#content_right .module_upper p";
    WebElement loggedInUserElement = driver.findElements(By.cssSelector(loggedInUserCss)).get(1);
    LOG.debug("loggedInUserElement: " + loggedInUserElement.getText());
    return (loggedInUserElement != null && loggedInUserElement.getText().contains(getAccount().getDisplayName()));
  }


  @Override
  public void logout() {
    String logoutLinkText = "Afmelden";
    WebElement logoutLink = driver.findElement(By.linkText(logoutLinkText));
    activateAndWaitForNewPage(logoutLink);
    assert (!isLoggedIn());
    LOG.debug("Logout page is titled " + driver.getTitle());
  }


  private void navigateToHistoryPage() {
    final String historyLinkText = "Eerder geleende titels";
    WebElement historyLink = driver.findElement(By.linkText(historyLinkText));
    String historyPageUrl = historyLink.getAttribute("href");
    historyPageUrl = historyPageUrl.replace("aantal=10", "aantal=" + numberOfBooksPerPage);

    setAttribute(historyLink, "href", historyPageUrl);
    historyLink.click();
  }


  private List<WebElement> collectHistory() throws IOException {

    List<WebElement> bookElements = new ArrayList<>();

    WebElement resultsBox = driver.findElement(By.id("results"));
    List<WebElement> results = resultsBox.findElements(By.tagName("span"));
    assert (results.size() > 2);

    final int startIdx = Integer.parseInt(results.get(0).getText());
    final int endIdx = Integer.parseInt(results.get(1).getText());
    final int totalBooks = Integer.parseInt(results.get(2).getText());
    int numberOfPages = totalBooks / numberOfBooksPerPage + (((totalBooks % numberOfBooksPerPage) > 0) ? 1 : 0);
    LOG.info("Found " + totalBooks + " books, divided over " + numberOfPages + " pages of " + numberOfBooksPerPage + " books "
        + "each");
    LOG.debug("Current page starts at number " + startIdx + " and ends at " + endIdx);

    // Collect all books
    for (int pageNumber = 1; pageNumber <= (numberOfPages); pageNumber++) {
      if (pageNumber > 1) {
        navigateToBookPageByPageNumber(pageNumber);
      }
      LOG.debug("Processing page " + pageNumber);
      bookElements.addAll(collectBookElementsOnPage());
    }

    LOG.info("Books expected: " + totalBooks + ", books collected: " + bookElements.size());

    return bookElements;
  }


  private void navigateToBookPageByPageNumber(int pageNumber) throws IOException {
    LOG.debug("Retrieving page for book page " + pageNumber);
    WebElement pageLink = driver.findElement(By.linkText("" + pageNumber));
    assert (pageLink != null);
    pageLink.click();
  }


  private List<WebElement> collectBookElementsOnPage() throws IOException {

    List<WebElement> bookElements = new ArrayList<>();

    List<WebElement> listElements = driver.findElements(By.tagName("ul"));

    List<WebElement> listItemElements;
    for (WebElement listElement : listElements) {
      if (listElement.getAttribute("class").contains("list_titels")) {
        listItemElements = listElement.findElements(By.tagName("li"));
        for (WebElement listItemElement : listItemElements) {
          if (listItemElement.getAttribute("class").contains("list_items")) {
            bookElements.add(listItemElement);
            Map<String, String> bookData = collectBookData(listItemElement);
          }
        }
        break;
      }
    }
    LOG.debug(bookElements.size() + " books found on page");
    return bookElements;
  }


  /*
  <li class="list_items">
  <div class="list_image"><a href="/cgi-bin/bx.pl?via=leenhist;titcode=881802;event=tdetail;sid=01053864-f30f-4432-b688-350b9c9cadf9;groepfx=10;vestnr=0014;prt=INTERNET;taal=nl_NL;var=iframe"><img class="list_cover_image" id="" src="/cgi-bin/momredir.pl?size=&amp;lid=2016253893;ppn=405032277;isbn=9789024574186;key=881802;" title="Naar Krabbel &amp; Nies : de avonturen van twee zwerfkatten" alt=""></a></div>
  <div class="list_text full">
  <a class="title" title="Naar Krabbel &amp; Nies : de avonturen van twee zwerfkatten" href="/cgi-bin/bx.pl?via=leenhist;titcode=881802;event=tdetail;sid=01053864-f30f-4432-b688-350b9c9cadf9;groepfx=10;vestnr=0014;prt=INTERNET;taal=nl_NL;var=iframe">Krabbel &amp; Nies : de avonturen van twee zwerfkatten</a><ul>
  <li>
  <span class="vet">Feller, Pieter</span><span class="leendatum">Leendatum: <span class="vet">04-01-2017</span></span>
  </li>
  <li>
  <span class="summ" id="summ_881802"></span><a class="readon" href="/cgi-bin/bx.pl?via=leenhist;titcode=881802;event=tdetail;sid=01053864-f30f-4432-b688-350b9c9cadf9;groepfx=10;vestnr=0014;prt=INTERNET;taal=nl_NL;var=iframe">...Lees meer</a>
  </li>
  </ul>
  </div>
  <div class="list_buttons"><div class="waardering" id="881802"></div></div>
  </li>
  */
  private Map<String, String> collectBookData(WebElement bookElement) throws IOException {

    Map<String, String> bookData = new HashMap<>();

    // Get the title
    WebElement titleElement = bookElement.findElement(By.cssSelector("a .title"));
    final String title = titleElement.getAttribute("title");
    bookData.put("title", title);
    LOG.debug("Title" + SEP + title);

    // Get the details URL
    //"cgi-bin/bx.pl?via=leenhist;titcode=881802;event=tdetail;sid=24cb3bed-2d49-4254-b87f-8696f3679b89;groepfx=10;vestnr=0014;prt=INTERNET;taal=nl_NL;var=iframe"
    final String detailUrl = baseUrl + titleElement.getAttribute("href");
    bookData.put("detailUrl", detailUrl);
    LOG.debug("Detail URL" + SEP + detailUrl);

    WebElement coverImage = getCoverImage(bookElement);
    assert (coverImage != null);

    String coverImageUrl = baseUrl + coverImage.getAttribute("src");
    coverImageUrl = coverImageUrl.replace("size=", "size=" + coverImageSize);
    bookData.put("coverImageUrl", coverImageUrl);

    // coverImage.setAttribute("src", coverImageUrl);

    LOG.debug("coverImageUrl" + SEP + coverImageUrl);

    String borrowingDate = getBorrowingDate(bookElement);
    bookData.put("borrowingDate", borrowingDate);
    LOG.debug("borrowingDate" + SEP + borrowingDate);

    if (downloadingCoverImagesEnabled) {
      downloadCoverImage(coverImage, coverImageUrl);
    }

    if (collectingDetailsEnabled) {

      Map<String, String> bookDetails = loadAndProcessDetailsPage(detailUrl);
    }
    return bookData;
  }


  private WebElement getCoverImage(WebElement bookElement) throws IOException {
    List<WebElement> imageElements = bookElement.findElements(By.tagName("img"));
    for (WebElement imageElement : imageElements) {
      if (imageElement.getAttribute("class").equals("list_cover_image")) {
        return imageElement;
      }
    }
    return null;
  }


  private void downloadCoverImage(WebElement imageElement, String coverImageUrl) throws IOException {
    String titleNumber = getTextBetweenStrings(coverImageUrl, "key=", ";");
    String imagePath = imagesParentPath + titleNumber + ".jpg";
    File imageFile = new File(imagePath);

    // TO DO: Download the image file
  }


  private String getBorrowingDate(WebElement bookElement) {
    WebElement borrowingDateElement = bookElement.findElement(By.cssSelector("span.leendatum span.vet"));
    return borrowingDateElement.getText().trim();
  }


  /*
  <tr>
  <td class="tdet_label">Titelblok:</td>
  <td class="tdet_inh">Het grote geheim / Hans Kuyper, Martine Letterie &amp; Selma Noort ; met tek. van Saskia Halfmouw</td>
  </tr>
  */
  private Map<String, String> loadAndProcessDetailsPage(String detailUrl) throws IOException {

    Map<String, String> bookExtraDetails = new HashMap<>();

    driver.get(detailUrl);
    WebElement detailsTable = driver.findElement(By.id("tdet_detail")).findElement(By.tagName("table"));
    assert (detailsTable != null);

    List<WebElement> detailRows = detailsTable.findElements(By.tagName("tr"));

    String previousLabel = null;
    for (WebElement detailRow : detailRows) {
      final List<WebElement> cells = detailRow.findElements(By.tagName("td"));
      final WebElement labelCell = cells.get(0);
      final String rawLabel = labelCell.getText();
      String label = rawLabel.substring(0, rawLabel.length() - 1).trim();

      if (label.length() == 0 && previousLabel != null) {
        label = previousLabel;
      }
      previousLabel = label;

      WebElement valueCell = cells.get(0);
      String valueRaw = valueCell.getText();
      String value = valueRaw.trim();
      bookExtraDetails.put(label, value);
      LOG.debug(label + SEP + value);
    }
    return bookExtraDetails;
  }


  private String getTextBetweenStrings(String sourceText, String startStr, String endStr) {
    int startPos = sourceText.indexOf(startStr) + startStr.length();
    int endPos = sourceText.indexOf(endStr, startPos);
    return sourceText.substring(startPos, endPos);
  }

}
