package poc.jobs.collectors.selenium;


import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import lombok.Getter;
import lombok.Setter;


/**
 * Created by epotters on 2017-02-10
 */

public class FileDownloader {
  private static final Logger LOG = Logger.getLogger(FileDownloader.class);

  private static final Pattern CONTENT_TYPE_META_REGEXP = Pattern.compile("(<meta [^>]*http-equiv=\"Content-Type\"[^>]*)", 2);
  private static final Pattern ENCODING_REGEXP = Pattern.compile("charset=([-_A-Za-z0-9]*)", 2);

  private WebDriver driver;

  @Getter
  @Setter
  private String localDownloadPath = System.getProperty("java.io.tmpdir");

  @Getter
  @Setter
  private boolean followRedirects = true;
  private boolean mimicWebDriverCookieState = true;
  private int httpStatusOfLastDownloadAttempt = 0;


  public FileDownloader(WebDriver driver) {
    this.driver = driver;
  }


  protected static String getEncodingFromMeta(String pageSource) {
    Matcher metaMatcher = CONTENT_TYPE_META_REGEXP.matcher(pageSource);
    if (metaMatcher.find()) {
      Matcher encodingMatcher = ENCODING_REGEXP.matcher(metaMatcher.group(1));
      if (encodingMatcher.find()) {
        return encodingMatcher.group(1);
      }
    }
    return Charset.defaultCharset().name();
  }


  public void followRedirectsWhenDownloading(boolean value) {
    this.followRedirects = value;
  }


  public String downloadFile(WebElement element) throws Exception {
    return this.downloader(element, "href");
  }


  public String downloadFileOfFormAction(WebElement element) throws Exception {
    WebElement surroundingForm = element.findElement(By.xpath("ancestor::form"));
    String url = surroundingForm.getAttribute("action");
    String queryParameter = this.getQueryParameter(element);
    if (StringUtils.isNotEmpty(queryParameter)) {
      url = url + "?" + queryParameter;
    }

    return this.downloadFileFromUrl(new URL(url));
  }


  private String getQueryParameter(WebElement element) throws UnsupportedEncodingException {
    String nameElement = element.getAttribute("name");
    if (StringUtils.isNotEmpty(nameElement)) {
      String encoding = getEncodingFromMeta(this.driver.getPageSource());
      String valueElement = element.getAttribute("value");
      return nameElement + "=" + URLEncoder.encode(valueElement, encoding);
    } else {
      return "";
    }
  }


  public String downloadImage(WebElement element) throws Exception {
    return this.downloader(element, "src");
  }


  public void mimicWebDriverCookieState(boolean value) {
    this.mimicWebDriverCookieState = value;
  }


  private BasicCookieStore mimicCookieState(Set<Cookie> seleniumCookieSet) {
    BasicCookieStore mimicWebDriverCookieStore = new BasicCookieStore();

    for (Cookie seleniumCookie : seleniumCookieSet) {
      BasicClientCookie duplicateCookie = new BasicClientCookie(seleniumCookie.getName(), seleniumCookie.getValue());
      duplicateCookie.setDomain(seleniumCookie.getDomain());
      duplicateCookie.setSecure(seleniumCookie.isSecure());
      duplicateCookie.setExpiryDate(seleniumCookie.getExpiry());
      duplicateCookie.setPath(seleniumCookie.getPath());
      mimicWebDriverCookieStore.addCookie(duplicateCookie);
    }
    return mimicWebDriverCookieStore;
  }


  private String downloader(WebElement element, String attribute) throws Exception {
    String fileToDownloadLocation = element.getAttribute(attribute);
    if (fileToDownloadLocation.trim().equals("")) {
      throw new NullPointerException("The element you have specified does not link to anything!");
    } else {
      URL fileToDownload = new URL(fileToDownloadLocation);
      return this.downloadFileFromUrl(fileToDownload);
    }
  }


  private String downloadFileFromUrl(URL fileToDownload)
      throws KeyStoreException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException,
      KeyManagementException, URISyntaxException, ParseException {
    HttpGet httpRequest = new HttpGet(fileToDownload.toURI());
    return this.processRequest(httpRequest, fileToDownload, null);
  }


  public String downloadFileFromUrlByPost(URL fileToDownload, Map<String, String> parameters, String fileName)
      throws KeyStoreException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException,
      KeyManagementException, URISyntaxException, ParseException {
    HttpPost httpRequest = new HttpPost(fileToDownload.toURI());
    ArrayList<BasicNameValuePair> postParams = new ArrayList<>();

    for (Map.Entry entry : parameters.entrySet()) {
      postParams.add(new BasicNameValuePair((String) entry.getKey(), (String) entry.getValue()));
    }

    httpRequest.setEntity(new UrlEncodedFormEntity(postParams, Consts.UTF_8));
    return this.processRequest(httpRequest, fileToDownload, fileName);
  }


  private HttpClient prepareClient()
      throws KeyStoreException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException,
      KeyManagementException, URISyntaxException, ParseException {
    HttpClientBuilder clientBuilder = HttpClientBuilder.create();
    return clientBuilder.build();
  }


  private BasicHttpContext prepareLocalContext() {
    BasicHttpContext localContext = new BasicHttpContext();
    LOG.info("Mimic WebDriver cookie state: " + this.mimicWebDriverCookieState);
    if (this.mimicWebDriverCookieState) {
      localContext.setAttribute("http.cookie-store", this.mimicCookieState(this.driver.manage().getCookies()));
    }

    return localContext;
  }


  private String processRequest(HttpRequestBase httpRequest, URL fileToDownload, String fileName)
      throws KeyStoreException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException,
      KeyManagementException, URISyntaxException, ParseException {
    HttpClient client = this.prepareClient();
    BasicHttpContext localContext = this.prepareLocalContext();
    RequestConfig.Builder configBuilder = RequestConfig.custom();
    configBuilder.setRedirectsEnabled(this.followRedirects);
    httpRequest.setConfig(configBuilder.build());
    LOG.info("Sending " + httpRequest.getMethod() + " request for: " + httpRequest.getURI());
    HttpResponse response = client.execute(httpRequest, localContext);
    this.httpStatusOfLastDownloadAttempt = response.getStatusLine().getStatusCode();
    LOG.info("HTTP " + httpRequest.getMethod() + " request status: " + this.httpStatusOfLastDownloadAttempt);
    String downloadedFileName =
        StringUtils.isNotEmpty(fileName) ? fileName : fileToDownload.getFile().replaceFirst("/|\\\\", "");


    /*

    Header contentDispositionHeader = response.getFirstHeader("Content-Disposition");
    if (contentDispositionHeader != null) {
      downloadedFileName = (new ContentDisposition(contentDispositionHeader.getValue())).getFileName();
    }
    */

    File downloadedFile = new File(this.localDownloadPath, downloadedFileName);
    if (!downloadedFile.canWrite() && downloadedFile.setWritable(true)) {
      LOG.debug("Changed permissions of downloaded file to writable");
    }

    LOG.info("Downloading file: " + downloadedFile.getName());
    FileUtils.copyInputStreamToFile(response.getEntity().getContent(), downloadedFile);
    response.getEntity().getContent().close();
    String downloadedFileAbsolutePath = downloadedFile.getAbsolutePath();
    LOG.info("File downloaded to \'" + downloadedFileAbsolutePath + "\'");
    return downloadedFileAbsolutePath;
  }

}

