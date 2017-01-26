package poc.jobs.collectors;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlImage;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;


/**
 * Created by eelko on 2015-02-14
 */
public class BibliotheekDataCollector extends BaseDataCollector implements DataCollector {

  private static final Log LOG = LogFactory.getLog(BibliotheekDataCollector.class);

  private final String collectorDisplayName = "Bibliotheek";
  private final String collectorName = "dutch-library";

  // Account
  private final String userName = "20105031598124";
  private final String password = "B@rb3r10";

  private static final String SEP = " - ";
  private final String baseUrl = "http://www.utrechtcat.nl";

  private final int numberOfBooksPerPage = 50;
  private final int coverImageSize = 900;
  private final boolean collectingDetailsEnabled = false;
  private final boolean downloadingCoverImagesEnabled = false;
  private final String imagesParentPath = "images/";

  @Value("${collectors.output-path}")
  private String outputPath;
  private String collectorOutputPath;

  private final WebClient webClient = new WebClient();


  public BibliotheekDataCollector() {

    collectorOutputPath = outputPath + collectorName + "/";
    LOG.debug("collectorOutputPath: " + collectorOutputPath);

    File imagesParent = new File(collectorOutputPath + imagesParentPath);
    if (!imagesParent.exists()) {
      imagesParent.mkdirs();
    }

  }


  @Override
  public void collect() throws IOException {

    LOG.debug("Logging in \"" + collectorDisplayName + "\"");
    HtmlPage menuPage = login();
    LOG.debug("Logged in \"" + collectorDisplayName + "\"");
    List<HtmlElement> bookElements = collectHistory(menuPage);

    LOG.debug("Collected " + bookElements.size() + " books");

    webClient.close();
  }


  private HtmlPage login() throws IOException {

    final String loginPageUrl = "http://www.utrechtcat.nl/cgi-bin/bx.pl?event=private&groepfx=10&vestnr=9990";

    final String loginFormName = "loginform";
    final String loginFormButtonName = "lener_knop";
    final String userNameFieldName = "newlener";
    final String passwordFieldName = "pinkode";

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

    final HtmlSubmitInput submitButton = loginForm.getInputByName(loginFormButtonName);
    assert (submitButton != null);
    LOG.debug("Fields set, ready to submit");

    final HtmlPage loginResultPage = submitButton.click();
    LOG.debug("Page title is: " + loginResultPage.getTitleText());
    return loginResultPage;
  }


  private List<HtmlElement> collectHistory(HtmlPage menuPage) throws IOException {

    List<HtmlElement> bookElements = new ArrayList<>();

    // Go to Borrowing History
    final String historyLinkText = "Eerder geleende titels";
    HtmlAnchor historyLink = menuPage.getAnchorByText(historyLinkText);
    String historyPageUrl = historyLink.getAttribute("href");
    historyPageUrl = historyPageUrl.replace("aantal=10", "aantal=" + numberOfBooksPerPage);
    historyLink.setAttribute("href", historyPageUrl);
    HtmlPage historyPage = historyLink.click();

    // Get the number of books
    DomElement resultsBox = historyPage.getElementById("results");
    DomNodeList<HtmlElement> results = resultsBox.getElementsByTagName("span");
    final int startIdx = Integer.parseInt(results.get(0).getTextContent());
    final int endIdx = Integer.parseInt(results.get(1).getTextContent());
    final int totalBooks = Integer.parseInt(results.get(2).getTextContent());
    int numberOfPages = totalBooks / numberOfBooksPerPage + (((totalBooks % numberOfBooksPerPage) > 0) ? 1 : 0);
    LOG.info("Found " + totalBooks + " books, divided over " + numberOfPages + " pages of " + numberOfBooksPerPage + " books "
        + "each");
    LOG.debug("Current page starts at number " + startIdx + " and ends at " + endIdx);

    // Collect all books
    HtmlPage bookPage = historyPage;
    for (int pageNumber = 1; pageNumber <= (numberOfPages); pageNumber++) {
      if (pageNumber > 1) {
        bookPage = getBookPageByPageNumber(bookPage, pageNumber);
      }
      LOG.debug("Processing page " + (pageNumber));
      bookElements.addAll(collectBookElementsOnPage(bookPage));
    }

    LOG.info("Books expected: " + totalBooks + ", books collected: " + bookElements.size());

    return bookElements;
  }


  private HtmlPage getBookPageByPageNumber(HtmlPage previousBooksPage, int pageNumber) throws IOException {
    LOG.debug("Retrieving page for book page " + pageNumber);
    HtmlAnchor pageLink = previousBooksPage.getAnchorByText("" + pageNumber);
    assert (pageLink != null);
    return pageLink.click();
  }


  private List<HtmlElement> collectBookElementsOnPage(HtmlPage booksPage) throws IOException {
    List<HtmlElement> bookElements = new ArrayList<>();
    assert (booksPage != null);

    DomNodeList<DomElement> listElements = booksPage.getElementsByTagName("ul");

    DomNodeList<HtmlElement> listItemElements;
    for (DomElement listElement : listElements) {
      if (listElement.getAttribute("class").contains("list_titels")) {
        listItemElements = listElement.getElementsByTagName("li");
        for (HtmlElement listItemElement : listItemElements) {
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
  private Map<String, String> collectBookData(HtmlElement bookElement) throws IOException {

    Map<String, String> bookData = new HashMap<>();

    // Get the title
    HtmlElement titleElement = bookElement.getElementsByAttribute("a", "class", "title").get(0);
    final String title = titleElement.getAttribute("title");
    bookData.put("title", title);
    LOG.debug("Title" + SEP + title);

    // Get the details URL
    //"cgi-bin/bx.pl?via=leenhist;titcode=881802;event=tdetail;sid=24cb3bed-2d49-4254-b87f-8696f3679b89;groepfx=10;vestnr=0014;prt=INTERNET;taal=nl_NL;var=iframe"
    final String detailUrl = baseUrl + titleElement.getAttribute("href");
    bookData.put("detailUrl", detailUrl);
    LOG.debug("Detail URL" + SEP + detailUrl);

    HtmlElement coverImage = getCoverImage(bookElement);
    assert (coverImage != null);

    String coverImageUrl = baseUrl + coverImage.getAttribute("src");
    coverImageUrl = coverImageUrl.replace("size=", "size=" + coverImageSize);
    bookData.put("coverImageUrl", coverImageUrl);
    coverImage.setAttribute("src", coverImageUrl);
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


  private HtmlElement getCoverImage(HtmlElement bookElement) throws IOException {
    DomNodeList<HtmlElement> imageElements = bookElement.getElementsByTagName("img");
    for (HtmlElement imageElement : imageElements) {
      if (imageElement.getAttribute("class").equals("list_cover_image")) {
        return imageElement;
      }
    }
    return null;
  }


  private void downloadCoverImage(HtmlElement imageElement, String coverImageUrl) throws IOException {
    String titleNumber = getTextBetweenStrings(coverImageUrl, "key=", ";");
    HtmlImage htmlImage = (HtmlImage) imageElement;
    String imagePath = imagesParentPath + titleNumber + ".jpg";
    File imageFile = new File(imagePath);
    htmlImage.saveAs(imageFile);
  }


  private String getBorrowingDate(HtmlElement bookElement) {
    String borrowingDate = "";
    DomNodeList<HtmlElement> borrowingDateParentElements = bookElement.getElementsByTagName("span");
    for (HtmlElement borrowingDateParentElement : borrowingDateParentElements) {
      if (borrowingDateParentElement.getAttribute("class").equals("leendatum")) {
        DomElement borrowingDateElement = borrowingDateParentElement.getFirstElementChild();
        borrowingDate = borrowingDateElement.getTextContent().trim();
        break;
      }
    }
    return borrowingDate;
  }


  /*
  <tr>
  <td class="tdet_label">Titelblok:</td>
  <td class="tdet_inh">Het grote geheim / Hans Kuyper, Martine Letterie &amp; Selma Noort ; met tek. van Saskia Halfmouw</td>
  </tr>
  */
  private Map<String, String> loadAndProcessDetailsPage(String detailUrl) throws IOException {

    Map<String, String> bookExtraDetails = new HashMap<>();

    HtmlPage detailsPage = webClient.getPage(detailUrl);
    HtmlElement detailsTable = detailsPage.getElementsByIdAndOrName("tdet_detail").get(0).getElementsByTagName("table").get(0);
    assert (detailsTable != null);

    DomNodeList<HtmlElement> detailRows = detailsTable.getElementsByTagName("tr");

    String previousLabel = null;
    for (HtmlElement detailRow : detailRows) {
      DomElement labelCell = detailRow.getFirstElementChild();
      String rawLabel = labelCell.getTextContent();
      String label = rawLabel.substring(0, rawLabel.length() - 1).trim();

      if (label.length() == 0 && previousLabel != null) {
        label = previousLabel;
      }
      previousLabel = label;

      DomElement valueCell = labelCell.getNextElementSibling();
      String valueRaw = valueCell.getTextContent();
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
