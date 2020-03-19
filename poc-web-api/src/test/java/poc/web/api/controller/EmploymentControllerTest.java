package poc.web.api.controller;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
import poc.core.domain.Employment;
import poc.core.domain.Organization;
import poc.core.domain.Person;
import poc.core.repository.EmploymentRepository;
import poc.core.repository.OrganizationRepository;
import poc.core.repository.PersonRepository;
import poc.web.api.config.TestRestConfiguration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.handler;
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

    String uri = "/api/employments/?filters=employer.id:15,startDate:1990&sort=employee.lastName,asc&page=0&size=150";

    Person senna = new Person("Senna", "Potters");
    Organization apple = new Organization("Apple");
    Employment employment = new Employment(senna, apple, LocalDate.of(2000, 1, 1), LocalDate.of(2007, 9, 26));
    List<Employment> employments = new ArrayList<>();
    employments.add(employment);

    Pageable pageable = PageRequest.of(0, 5);
    Page<Employment> page = new PageImpl<Employment>(employments, pageable, employments.size());
    Mockito.when(employmentRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

    mockMvc.perform(MockMvcRequestBuilders
        .get(uri)
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(handler().handlerType(EmploymentController.class))
        .andExpect(handler().methodName("findAllEmployments"))
        .andExpect(status().isOk());

    Mockito.verify(employmentRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
  }

  @Test
  @WithMockUser(value = "testuser")
  public void filterByPartialDate2() throws Exception {

    String uri = "/api/employments/?filters=employer.id:15,startDate:1990&sort=employee.lastName,asc&page=0&size=150";

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
        .get(uri).accept(MediaType.APPLICATION_JSON)).andReturn();

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }

  @Test
  @WithMockUser(value = "testuser")
  public void getSchema() throws Exception {

    String uri = "/api/employments/schema";

    MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(uri)
        .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

    int status = mvcResult.getResponse().getStatus();
    assertEquals(200, status);

    String content = mvcResult.getResponse().getContentAsString();
    System.out.print(content);
  }
}
