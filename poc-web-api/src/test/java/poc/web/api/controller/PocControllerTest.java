package poc.web.api.controller;


import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class PocControllerTest extends BaseControllerTest {

  @Test
  public void getWelcomeMessage() throws Exception {

    String uri = "/welcome";

    MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);


    String content = mvcResult.getResponse().getContentAsString();

    System.out.print(content);

//    Product[] productlist = super.mapFromJson(content, Product[].class);
//    assertTrue(productlist.length > 0);

  }
}
