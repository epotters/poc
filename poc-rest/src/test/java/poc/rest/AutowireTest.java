package poc.rest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import poc.core.repository.PersonRepository;
import poc.rest.controller.PersonController;

/**
 * Created by eelko on 08-01-2016.
 */
@ContextConfiguration(classes = {poc.rest.config.RestContext.class})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class, TransactionalTestExecutionListener.class})
@RunWith(SpringJUnit4ClassRunner.class)
public class AutowireTest {


  private static final Log LOG = LogFactory.getLog(AutowireTest.class);

  @Autowired
  private PersonRepository personRepository;

  @Autowired
  private PersonController personController;

  @Before
  public void prepareTests() {

    LOG.debug("@prepareTests");

  }

  @Test
  public void doesAutowireWork() {
    LOG.debug("@doesAutowireWork");
    Assert.assertNotNull(personRepository);
    Assert.assertNotNull(personController);
  }


}
