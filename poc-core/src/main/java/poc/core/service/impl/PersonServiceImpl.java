package poc.core.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import poc.core.domain.Person;
import poc.core.repository.PersonRepository;
import poc.core.service.PersonService;


@Component
@Transactional(propagation = Propagation.REQUIRED)
public class PersonServiceImpl implements PersonService {

  private PersonRepository personRepository;


  @Autowired
  PersonServiceImpl(PersonRepository personRepository) {
    this.personRepository = personRepository;
    assert (personRepository != null);
  }


  @Override
  public List<Person> getPersons() {
    return personRepository.findAll();
  }


  @Override
  public Person getPerson(Long id) {
    return personRepository.getOne(id);
  }


  @Override
  public Person savePerson(Person person) {
    return personRepository.save(person);
  }


  @Override
  public Person deletePerson(Person person) {
    personRepository.delete(person);
    return null;
  }

}
