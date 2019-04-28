package poc.web.api.controller;


import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.data.jpa.domain.Specification;
import poc.core.domain.Person;


public class QuerystringFilterTranslatorTest {

  @Test
  public void translate() {

    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>();

    String queryString = "firstName~jaco,lastName~bijk,age>25,city:Utrecht,";
    Specification<Person> spec = filterTanslator.translate(queryString);
    Assert.assertNotNull(spec);

    queryString = "firstName@jaco,lastName+bijk";
    spec = filterTanslator.translate(queryString);
    Assert.assertNull(spec);
  }


  @Test
  public void translateListOfFilters() {

    QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>();
    List<String> filters = Arrays.asList("firstName~eel,lastName~pot", "firstName~jaco,lastName~bijk", "age>25,city:Utrecht");
    Specification<Person> spec = filterTanslator.translate(filters);
    Assert.assertNotNull(spec);
  }

}
