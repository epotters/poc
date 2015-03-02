package poc.core.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import poc.core.model.Person;

import static org.junit.Assert.assertEquals;

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

    final Long id = new Long(100);
    final String firstName = "Eelko";
    final String lastName = "Potters";

    Person person = personRepository.findOne(id);

    assertEquals(null, person);

    Person newPerson = new Person();

    newPerson.setId(id);
    newPerson.setFirstName(firstName);
    newPerson.setLastName(lastName);
    personRepository.save(person);

    person = personRepository.findOne(id);
    assertEquals(person.getFirstName(), newPerson.getFirstName());
    assertEquals(person.getLastName(), newPerson.getLastName());

    personRepository.delete(id);
    person = personRepository.findOne(id);
    assertEquals(null, person);

  }

}
