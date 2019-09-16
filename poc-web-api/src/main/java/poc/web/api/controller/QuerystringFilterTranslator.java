package poc.web.api.controller;


import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import poc.core.repository.specification.BaseSpecification;
import poc.core.repository.specification.SearchCriteria;
import poc.core.repository.specification.SearchOperation;
import poc.core.repository.specification.SpecificationsBuilder;


@Slf4j
class QuerystringFilterTranslator<T> implements FilterTranslator<T> {

  private final Class<T> genericType;

  private ObjectMapper mapper;

  private static final String SEPARATOR = ",";
  private final String operationSetExpr = "(" + String.join("|", SearchOperation.SIMPLE_OPERATION_SET) + ")";
  private final Pattern pattern = Pattern.compile("(\\w+?)" + operationSetExpr + "(.*$)", Pattern.UNICODE_CHARACTER_CLASS);

  private static final SearchCriteria ALWAYS_TRUE_CRITERIA = new SearchCriteria("1", SearchOperation.EQUALITY, "1");


  public QuerystringFilterTranslator(Class<T> genericType) {
    this.genericType = genericType;
    assert (this.genericType != null);
  }


  @Override
  public Specification<T> translate(final String filterParam) {
    final SpecificationsBuilder<T> builder = new SpecificationsBuilder<>();
    final String[] labelValueParts = filterParam.split(SEPARATOR);
    Matcher matcher;
    String fieldName;
    String operator;
    String rawValue;
    Object value = null;

    for (String labelValue : labelValueParts) {
      if (!"".equals(labelValue)) {
        matcher = pattern.matcher(labelValue);
        if (matcher.find()) {

          fieldName = matcher.group(1);
          operator = matcher.group(2);
          rawValue = matcher.group(3);

         log.debug("Matched filter: " + fieldName + operator + rawValue);

          Class<?> fieldType = null;
          try {
            fieldType = this.getFieldType(fieldName);
          } catch (NoSuchFieldException nsfe) {
            log.warn("Field \"" + fieldName + "\" does not exist. Skipping.");
            continue;
          }
          if (fieldType.getSimpleName().equals("String")) {
            value = rawValue + (("~".equals(operator)) ? SearchOperation.WILDCARD : "");
          } else {

            try {
              value = this.mapStringValueToObject(fieldType, rawValue);
            } catch (Exception e) {
              log.warn("Unable to translate value \"" + rawValue + "\" to " + fieldType.getSimpleName() + " Skipping.");
            }
          }

          if (value != null) {
            builder.with(fieldName, operator, value);
          }
        }
      }
    }
    return builder.build();
  }


  // TODO: Add a unit test
  // Batch
  public Specification<T> translate(List<String> filters) {
    Specification<T> specs = new BaseSpecification<T>(ALWAYS_TRUE_CRITERIA);
    for (String filter : filters) {
      specs.or(translate(filter));
    }
    return specs;
  }


  // Not prepared for multiple filters yet
  public List<String> fieldNames(String filterParam) {
    List<String> fieldNames = new ArrayList<>();
    String[] labelValueParts = filterParam.split(SEPARATOR);
    Matcher matcher;
    String fieldName;
    for (String labelValue : labelValueParts) {
      if (!"".equals(labelValue)) {
        matcher = pattern.matcher(labelValue);
        if (matcher.find()) {
          fieldName = matcher.group(1);
          fieldNames.add(fieldName);
        }
      }
    }
    return fieldNames;
  }


  private ObjectMapper objectMapper() {
    if (this.mapper == null) {
      this.mapper = new ObjectMapper();
      mapper.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
      mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      mapper.registerModule(new JavaTimeModule());
      return mapper;
    } else {
      return this.mapper;
    }
  }


  private Class<?> getFieldType(String fieldName) throws NoSuchFieldException {
    final Field field = genericType.getDeclaredField(fieldName);
    final Class<?> valueType = field.getType();
    log.debug("Found field named \"" + field.getName() + "\" with type \"" + valueType.getSimpleName() + "\"");
    return valueType;
  }


  private Object mapStringValueToObject(Class<?> fieldType, String rawValue) throws IOException {
    ObjectMapper mapper = this.objectMapper();
    return mapper.readValue(mapper.writeValueAsString(rawValue), fieldType);
  }


  Object mapStringValueToObject(String fieldName, String rawValue) throws IOException, NoSuchFieldException {
    Class<?> fieldType = this.getFieldType(fieldName);
    return mapStringValueToObject(fieldType, rawValue);
  }


}
