package epotters.poc.core.service.impl;


import epotters.poc.core.dao.PersonDao;
import epotters.poc.core.model.Person;

import epotters.poc.core.service.PersonService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.List;


/**
 * Created by epotters on 9-10-2014.
 */
public class PersonServiceImpl implements PersonService {

  private PersonDao personDao;

  private static final Log LOG = LogFactory.getLog(PersonServiceImpl.class);

  @Override
  public List<Person> getPersons() {
    return null;
  }


  @Override
  public Person getPerson(Long id) {
    return null;
  }


  @Override
  public Person savePerson(Person person) {
    return null;
  }


  @Override
  public Person deletePerson(Person person) {
    return null;
  }



  public PersonDao getPersonDao() {
    return personDao;
  }


  public void setPersonDao(PersonDao personDao) {
    this.personDao = personDao;
  }
}
