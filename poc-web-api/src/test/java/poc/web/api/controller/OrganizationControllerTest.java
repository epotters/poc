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


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestRestConfiguration.class)
@WebMvcTest(controllers = OrganizationController.class)
public class OrganizationControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private OrganizationRepository organizationRepository;

  @MockBean
  private PersonRepository personRepository;

  @MockBean
  private EmploymentRepository employmentRepository;

  @MockBean
  private JwtDecoder jwtDecoder;

  @MockBean
  PlatformTransactionManager transactionManager;

  @Test
  public void contexLoads() throws Exception {
    assertThat(mockMvc).isNotNull();
    assertThat(organizationRepository).isNotNull();
  }


  @Test
  @WithMockUser(value = "testuser")
  public void getOrganizations() throws Exception {

    String uri = "/api/organizations/";

    assert (mockMvc != null);

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }


  @Test
  @WithMockUser(value = "testuser")
  public void getSchema() throws Exception {

    String uri = "/api/organizations/schema";

    assert (mockMvc != null);

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }
}
