package poc.core.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import poc.core.repository.PersonRepository;

/**
 * Created by eelko on 06-02-2015.
 */

@RunWith(MockitoJUnitRunner.class)
public class PersonServiceTest {


  @Autowired
  private PersonRepository personRepository;

  @Test
  public void savePerson() throws Exception {
  }

}
