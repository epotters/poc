package poc.core.service;


import poc.core.repository.PersonRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * Created by eelko on 2015-02-06
 */

@RunWith(MockitoJUnitRunner.class)
public class PersonServiceTest {

  @Autowired
  private PersonRepository personRepository;


  @Test
  public void savePerson() throws Exception {

  }

}
