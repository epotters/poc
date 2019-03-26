package poc.web.api.controller;


import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.Assert.assertEquals;


public class PersonControllerTest extends BaseControllerTest {

  @Test
  public void geSchema() throws Exception {

    String uri = "/api/people/schema";

    MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);


    String content = mvcResult.getResponse().getContentAsString();

    System.out.print(content);
  }
}
