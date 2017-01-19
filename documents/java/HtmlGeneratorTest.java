package nl.abz.os;


import java.io.IOException;

import org.junit.Before;
import org.junit.Test;


public class HtmlGeneratorTest {
  private HtmlGenerator htmlGenerator;


  @Before()
  public void init() throws IOException {
    htmlGenerator = new HtmlGenerator();
  }


  @Test()
  public void webAppTest() throws IOException {
    htmlGenerator.buildIndex(HtmlGenerator.MODE_WEBAPP, "index.html");
  }


  @Test()
  public void appTest() throws IOException {
    htmlGenerator.buildIndex(HtmlGenerator.MODE_APP, "phonegap.html");
    htmlGenerator.buildIndex(HtmlGenerator.MODE_APP, "../phonegap/index.html");
    //htmlGenerator.buildIndex(HtmlGenerator.MODE_WEBAPP, "test.html");
  }


  @Test()
  public void whiteLabelTest() throws IOException {
    htmlGenerator.buildWhiteLabels();
  }


  @Test()
  public void nvgaTest() throws IOException {
    htmlGenerator.buildIntros();
  }
}
