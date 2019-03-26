package poc.web.api.controller;


import java.io.IOException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import poc.core.domain.Person;


@RunWith(SpringRunner.class)
public class JsonSchemaGeneratorTest {

  @Test
  public void printJsonSchema() throws IOException {

    JsonSchemaGenerator generator = new JsonSchemaGenerator();
    System.out.println(generator.generate(Person.class));

  }

}
