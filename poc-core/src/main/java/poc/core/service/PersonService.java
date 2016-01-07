package poc.core.service;

import poc.core.domain.Person;

import java.util.List;


/**
 * Created by epotters on 9-10-2014.
 */
public interface PersonService {

  List<Person> getPersons();

  Person getPerson(Long id);

  Person savePerson(Person person);

  Person deletePerson(Person person);

}
