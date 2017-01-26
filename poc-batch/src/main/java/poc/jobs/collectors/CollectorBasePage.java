package poc.jobs.collectors;


import java.util.Arrays;
import java.util.List;

import com.gargoylesoftware.htmlunit.html.HtmlElement;


/**
 * Created by epotters on 26-1-2017.
 */
public class CollectorBasePage {

  public HtmlElement findElementByTagAndClass(HtmlElement parentElement, String tagName, String cssClass) {
    final String attributeName = "class";
    List<HtmlElement> elements = parentElement.getElementsByTagName(tagName);
    for (HtmlElement element : elements) {
      String[] cssClasses = element.getAttribute(attributeName).split(" ");
      if (Arrays.asList(cssClasses).contains(cssClass)) {
        return element;
      }
    }
    return null;
  }

}
