package poc.web.api.controller;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.data.jpa.domain.Specification;
import poc.core.domain.Gender;
import poc.core.domain.Person;


public class QuerystringFilterTranslatorTest {

  @Test
  public void translate() {

    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>(Person.class);

    String queryString = "firstName~jaco,lastName~bijk,age>25,city:Utrecht,";
    Specification<Person> spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "firstName@jaco,lastName+bijk";
    spec = filterTanslator.translate(queryString);
    Assert.assertNull(spec);

    queryString = "gender:MALE,birthDate:1988-12-16";
    spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "birthDate:1995-12-05";
    spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "gender:blah";
    spec = filterTanslator.translate(queryString);
    Assert.assertNull(spec);
  }

  @Test
  public void ConvertStringsToObjects() {

    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>(Person.class);

    try {
      Object typedValue = filterTanslator.mapStringValueToObject("gender", "MALE");

      System.out.println(typedValue.getClass());
      System.out.println(typedValue);

      assert (typedValue instanceof Gender);
    } catch (Exception e) {
      e.printStackTrace();
    }

    try {
      Object typedValue = filterTanslator.mapStringValueToObject("birthDate", "1988-12-16");

      System.out.println(typedValue.getClass());
      System.out.println(typedValue);

      assert (typedValue instanceof LocalDate);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }


  @Test
  public void translateListOfFilters() {
    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>(Person.class);
    List<String> filters = Arrays.asList("firstName~eel,lastName~pot", "firstName~jaco,lastName~bijk", "gender=FEMALE", "age>25,city:Utrecht");
    Specification<Person> spec = filterTanslator.translate(filters);
    Assert.assertNotNull(spec);
  }

}
