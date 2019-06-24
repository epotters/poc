package authorization.service;


import authorization.PocAuthorizationServer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;


@SpringBootTest(classes = {PocAuthorizationServer.class}, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class})

@RunWith(SpringRunner.class)
public class ClientAccountServiceTest {

  @Autowired
  private ClientAccountsService clientAccountsService;


  @Test
  public void getClient() throws Exception {

    ClientDetails clientAccount = clientAccountsService.loadClientAccountByClientId("poc");

    System.out.println("\n");
    System.out.println(clientAccount);
    System.out.println("\n");

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    Assert.assertTrue("Client secret found does not match expected client secret",
        passwordEncoder.matches("9876543210", clientAccount.getClientSecret()));
  }

}
