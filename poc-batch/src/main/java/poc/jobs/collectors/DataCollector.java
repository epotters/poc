package poc.jobs.collectors;


import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * Created by epotters on 2017-01-24
 */
public interface DataCollector {

  HtmlPage login(HtmlPage loginPage) throws Exception;

  void collect() throws Exception;

}
