package poc.jobs.collectors;


import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;


/**
 * Created by epotters on 2017-01-24
 */
@PropertySource("/application.properties")
public class BaseDataCollector {



  @Value("${collectors.output-path}")
  String outputPath;
  String collectorOutputPath;


  WebDriver driver;


  BaseDataCollector() {


  }




}
