package authorization.service;


import authorization.PocAuthorizationServer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;


@SpringBootTest(classes = {PocAuthorizationServer.class}, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class})
@RunWith(SpringRunner.class)
public class UserAccountServiceTest {

  @Autowired
  private UserAccountsService userAccountsService;


  @Test
  public void getUser() throws Exception {

    UserDetails userDetails = userAccountsService.loadUserByUsername("epo");
    assert (userDetails != null);
    System.out.println(userDetails);

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    Assert.assertTrue("Password found does not match expected password",
        passwordEncoder.matches("12345", userDetails.getPassword()));
  }

}
