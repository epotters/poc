package poc.core.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import poc.core.model.Person;
import poc.core.repository.PersonRepository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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

    final String firstName = "Eelko";
    final String lastName = "Potters";

    List<Person> people = new ArrayList<Person>();
    people = personRepository.findByLastName(lastName);

    assertEquals(0, people.size());

    Person person = new Person();
    person.setFirstName(firstName);
    person.setLastName(lastName);

    personRepository.save(person);

    people = personRepository.findByLastName(lastName);

    assertEquals(1, people.size());
  }

}
