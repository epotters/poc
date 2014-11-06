package epotters.poc.core.dao.impl;


import epotters.poc.core.dao.PersonDao;
import epotters.poc.core.model.Person;

import java.util.Calendar;
import java.util.Date;
import java.util.List;


/**
 * Created by epotters on 6-11-2014.
 */
public class PersonDaoImpl implements PersonDao {

  @Override
  public List<Person> getPersons() {
    return null;
  }


  @Override
  public Person getPerson(Long id) {

    Person person = new Person();
    person.setFirstName("Alexander");
    person.setPrefix("van der");
    person.setLastName("Hoogenband");
    person.setGender("Man");
    person.setBirthDate(createDate(1972, 11, 14, 0, 0, 0));
    person.setBirthPlace("Amsterdam");

    return person;

  }


  @Override
  public Person savePerson(Person person) {
    return null;
  }


  @Override
  public Person deletePerson(Person person) {
    return null;
  }

  private Date createDate(int year, int month, int day, int hour, int minute, int second) {
    Calendar cal = Calendar.getInstance();
    cal.setTimeInMillis(0);
    cal.set(year, month, day, hour, minute, second);
    return cal.getTime(); // get back a Date object
  }
}
