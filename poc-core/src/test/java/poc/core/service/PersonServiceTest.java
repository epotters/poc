package poc.core.service;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.transaction.annotation.Transactional;

import poc.core.config.CoreContext;
import poc.core.repository.PersonRepository;


@SpringBootTest(classes = {CoreContext.class}, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class})
@Transactional
@RunWith(SpringRunner.class)
public class PersonServiceTest {

  @Autowired
  private PersonRepository personRepository;


  @Test
  public void savePerson() throws Exception {

  }

}
