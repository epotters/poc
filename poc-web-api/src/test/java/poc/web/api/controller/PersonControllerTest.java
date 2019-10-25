package poc.web.api.controller;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import poc.core.repository.PersonRepository;
import poc.web.api.config.TestRestConfiguration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestRestConfiguration.class)
@WebMvcTest(PersonController.class)
public class PersonControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PersonRepository personRepository;

  @Test
  public void contexLoads() throws Exception {
    assertThat(mockMvc).isNotNull();
    assertThat(personRepository).isNotNull();
  }


  @Test
  public void getSchema() throws Exception {

    String uri = "/api/people/schema";

    assert (mockMvc != null);

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }
}
