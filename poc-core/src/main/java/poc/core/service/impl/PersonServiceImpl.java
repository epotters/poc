package poc.core.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import poc.core.domain.Person;
import poc.core.repository.PersonRepository;
import poc.core.service.PersonService;


@Component
public class PersonServiceImpl implements PersonService {

  private PersonRepository personRepository;


  @Autowired
  PersonServiceImpl(PersonRepository personRepository) {
    this.personRepository = personRepository;
    assert (personRepository != null);
  }


  @Override
  public List<Person> getPersons() {

    int pageNumber = 5;
    int pageSize = 50;

    Sort sort = new Sort(new Sort.Order(Sort.Direction.ASC, "id"), new Sort.Order(Sort.Direction.DESC, "fullName"));
    PageRequest pageRequest = new PageRequest(pageNumber, pageSize, sort);

    Page<Person> page = personRepository.findAll(pageRequest);
    return page.getContent();
  }


  @Override
  public Person getPerson(Long id) {
    return personRepository.findOne(id);
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
