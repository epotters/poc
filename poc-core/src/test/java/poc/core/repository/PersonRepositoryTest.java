package poc.core.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import poc.core.model.Person;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

/**
 * Created by eelko on 06-02-2015.
 */

@RunWith(MockitoJUnitRunner.class)
// @ContextConfiguration(classes = {TestContext.class})
public class PersonRepositoryTest {


  @Autowired
  private PersonRepository personRepository;

  @Test
  public void savePerson() throws Exception {
  }

}
