package poc.core.service;


import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.transaction.annotation.Transactional;

import poc.core.config.CoreContext;


@SpringBootTest(classes = { CoreContext.class }, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class })
@Transactional
@RunWith(SpringRunner.class)
public class SecurityServiceTest {

  @Autowired
  private SecurityService securityService;


  @Test
  public void getUser() throws Exception {

    assert(securityService != null);

    UserDetails userDetails = securityService.loadUserByUsername("epo");
    assert(userDetails != null);
    System.out.println(userDetails);

    Assert.assertEquals("Password found name does not match expected password", "12345", userDetails.getPassword());
  }

}
