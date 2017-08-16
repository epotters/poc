package poc.rest;


import java.io.IOException;

import javax.persistence.EntityManagerFactory;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.module.jsonSchema.JsonSchema;
import com.fasterxml.jackson.module.jsonSchema.JsonSchemaGenerator;

import poc.core.domain.Person;


/**
 * Created by epotters on 2017-03-20
 */

@RunWith(SpringRunner.class)
public class JsonSchemaGeneratorTest {

  @Test
  public void getJsonSchema() throws IOException {

    EntityManagerFactory entityManagerFactory;

    Class clazz = Person.class;
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
    JsonSchemaGenerator schemaGenerator = new JsonSchemaGenerator(mapper);
    JsonSchema schema = schemaGenerator.generateSchema(clazz);

    System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(schema));
    Assert.assertNotNull(schema);
  }
}
