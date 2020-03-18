package poc.web.api.controller;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.PlatformTransactionManager;
import poc.core.repository.EmploymentRepository;
import poc.core.repository.OrganizationRepository;
import poc.core.repository.PersonRepository;
import poc.web.api.config.TestRestConfiguration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestRestConfiguration.class)
@WebMvcTest(controllers = EmploymentController.class)
public class EmploymentControllerTest {


  @MockBean
  private PersonRepository personRepository;

  @MockBean
  private OrganizationRepository organizationRepository;

  @MockBean
  private EmploymentRepository employmentRepository;

  @MockBean
  private JwtDecoder jwtDecoder;

  @MockBean
  PlatformTransactionManager transactionManager;

  @Autowired
  private MockMvc mockMvc;

  @Test
  @WithMockUser(value = "testuser")
  public void contexLoads() throws Exception {
    assertThat(mockMvc).isNotNull();
    assertThat(employmentRepository).isNotNull();
  }


  @Test
  @WithMockUser(value = "testuser")
  public void filterByPartialDate() throws Exception {
    mockMvc.perform(MockMvcRequestBuilders
        .get("/api/employments/?filters=startDate:2020")
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());
  }


  @Test
  @WithMockUser(value = "testuser")
  public void getSchema() throws Exception {

    String uri = "/api/employments/schema";

    assert (mockMvc != null);

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }
}
