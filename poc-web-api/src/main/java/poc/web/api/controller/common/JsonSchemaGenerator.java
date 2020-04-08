package poc.web.api.controller.common;


import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.jsonSchema.JsonSchema;
import com.fasterxml.jackson.module.jsonSchema.factories.SchemaFactoryWrapper;


public class JsonSchemaGenerator {


  public String generate(Class clazz) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    objectMapper.registerModule(new JavaTimeModule());

    SchemaFactoryWrapper visitor = new SchemaFactoryWrapper();
    objectMapper.acceptJsonFormatVisitor(objectMapper.constructType(clazz), visitor);
    JsonSchema jsonSchema = visitor.finalSchema();

    return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonSchema);
  }

}


