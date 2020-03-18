package poc.web.api.controller;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import poc.core.repository.EmploymentRepository;
import poc.core.repository.OrganizationRepository;
import poc.core.repository.PersonRepository;
import poc.web.api.config.TestRestConfiguration;
import poc.web.api.service.LocalizedMessageService;

import static org.assertj.core.api.Assertions.assertThat;


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestRestConfiguration.class)
@WebMvcTest(controllers = PocController.class)
public class PocControllerTest {

  @MockBean
  private PersonRepository personRepository;

  @MockBean
  private OrganizationRepository organizationRepository;

  @MockBean
  private EmploymentRepository employmentRepository;

  @MockBean
  private JwtDecoder jwtDecoder;

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private LocalizedMessageService messageService;


  @Test
  public void contexLoads() throws Exception {
    assertThat(messageService).isNotNull();
  }

}
