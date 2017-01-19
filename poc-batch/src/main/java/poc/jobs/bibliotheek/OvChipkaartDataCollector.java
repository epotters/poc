package poc.jobs.bibliotheek;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


/**
 * Created by eelko on 2017-01-16
 */
public class OvChipkaartDataCollector {

  private static final Log LOG = LogFactory.getLog(OvChipkaartDataCollector.class);

  private static String SOURCE_NAME = "OV Chipkaart";

  private HtmlUnitDriver driver;


  public OvChipkaartDataCollector() {
    init();
  }


  private void init() {
    driver = new HtmlUnitDriver(true);
    driver.setJavascriptEnabled(true);
  }


  public void collect() {
    LOG.debug("Logging in \"" + SOURCE_NAME + "\"");
    login();
    driver.quit();
  }


  private void login() {

  }

}
