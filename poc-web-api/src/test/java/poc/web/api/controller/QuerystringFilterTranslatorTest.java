package poc.web.api.controller;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.data.jpa.domain.Specification;
import poc.core.domain.Employment;
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

    queryString = "birthDate:1995";
    spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "birthDate:1995-12";
    spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "gender:blah";
    spec = filterTanslator.translate(queryString);
    Assert.assertNull(spec);
  }


  @Test
  public void translateNested() {
    QuerystringFilterTranslator<Employment> filterTanslator = new QuerystringFilterTranslator<>(Employment.class);

    String queryString = "employee.id:5";
    Specification<Employment> spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);
  }


  @Test
  public void ConvertStringsToObjects() {

    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>(Person.class);

    this.conversionTest(filterTanslator, "id", "105", Long.class);
    this.conversionTest(filterTanslator, "firstName", "Piet", String.class);
    this.conversionTest(filterTanslator, "gender", "FEMALE", Gender.class);
    this.conversionTest(filterTanslator, "birthDate", "1988-12-16", LocalDate.class);
  }


  private void conversionTest(QuerystringFilterTranslator<Person> filterTanslator, String fieldName, String rawValue, Class expectedClass) {
    try {
      Object typedValue = filterTanslator.mapStringValueToObject(fieldName, rawValue);
      System.out.println(typedValue.getClass());
      System.out.println(typedValue);
      assert (expectedClass.isInstance(typedValue));
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
