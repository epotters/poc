package poc.core.service;


import java.util.List;

import poc.core.domain.Person;


public interface PersonService {

  List<Person> getPersons();

  Person getPerson(Long id);

  Person savePerson(Person person);

  Person deletePerson(Person person);

}
