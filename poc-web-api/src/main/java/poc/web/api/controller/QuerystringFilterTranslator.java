package poc.web.api.controller;


import java.io.IOException;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.Getter;
import lombok.Setter;
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
  private static final String RANGE_DENOMINATOR = "...";
  
  private final String operationSetExpr = "(" + String.join("|", SearchOperation.SIMPLE_OPERATION_SET) + ")";
  private final Pattern pattern = Pattern.compile("(\\w+\\.?\\w+)" + operationSetExpr + "(.*$)", Pattern.UNICODE_CHARACTER_CLASS);

  private static final SearchCriteria ALWAYS_TRUE_CRITERIA = new SearchCriteria("1", SearchOperation.EQUALITY, "1");

  private static final Pattern YEAR_PATTERN = Pattern.compile("^([012][0-9]{3})$");
  private static final Pattern YEAR_MONTH_PATTERN = Pattern.compile("^([012][0-9]{3})-(0[1-9]|1[012])$");
  private static final Pattern MONTH_DAY_PATTERN = Pattern.compile("^(0[1-9]|1[012])-([0123][0-9])$");

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
    Object value;

    for (String labelValue : labelValueParts) {
      if ("".equals(labelValue)) {
        continue;
      }
      matcher = pattern.matcher(labelValue);
      if (matcher.find()) {

        fieldName = matcher.group(1);
        operator = matcher.group(2);
        rawValue = matcher.group(3);
        log.debug("Matched filter: " + fieldName + operator + rawValue);


        // Find field type
        Class<?> fieldType = this.determineFieldType(fieldName);
        if (fieldType == null) {
          continue;
        }

        // Detect ranges
        if (rawValue.contains(RANGE_DENOMINATOR)) {

          log.debug("Range search detected");

          String[] rangeEnds = rawValue.split("\\.{3}", -1);
          log.debug("length: " + rangeEnds.length);

          if (rangeEnds.length != 2) {
            log.warn("Invalid range. Skipping \"" + rawValue + "\" length " + rangeEnds.length);
          }

          Object rangeStart = determineValue(rangeEnds[0], fieldName, fieldType, operator, builder);
          Object rangeEnd = determineValue(rangeEnds[1], fieldName, fieldType, operator, builder);

          if (rangeStart != null) {
            if (rangeStart instanceof DateRange) {
              rangeStart = ((DateRange) rangeStart).getStart().minusDays(1);
            }
            log.debug("rangeStart: " + rangeStart);
            builder.with(fieldName, ">", rangeStart);
          }

          if (rangeEnd != null) {
            if (rangeEnd instanceof DateRange) {
              rangeEnd = ((DateRange) rangeEnd).getEnd().plusDays(1);
            }
            log.debug("rangeEnd: " + rangeEnd);
            builder.with(fieldName, "<", rangeEnd);
          }
        } else {
          // Process the raw value
          value = determineValue(rawValue, fieldName, fieldType, operator, builder);

          if (value != null) {
            if (value instanceof DateRange) {
              builder.with(fieldName, ">", ((DateRange) value).getStart().minusDays(1));
              builder.with(fieldName, "<", ((DateRange) value).getEnd().plusDays(1));
            } else {
              builder.with(fieldName, operator, value);
            }
          }
        }
      } else {
        log.warn("Not a valid labelValue pair: \"" + labelValue + "\". Skipping.");
      }
    }
    return builder.build();
  }


  private Class<?> determineFieldType(String fieldName) {
    Class<?> fieldType = null;
    if (fieldName.contains(".")) {
      log.debug("Processing nested field");
      String[] fieldNames = fieldName.split("\\.");
      if (fieldNames.length > 2) {
        log.warn("Only one level of nesting is supported. Skipping \"" + fieldName + "\"");
      }
      try {
        Class<?> relatedEntityType = this.getFieldType(fieldNames[0]);
        fieldType = this.getFieldType(relatedEntityType, fieldNames[1]);
      } catch (NoSuchFieldException nsfe) {
        nsfe.printStackTrace();
        log.warn("Field \"" + fieldName + "\" does not exist. Skipping.");
      }
    } else {
      try {
        fieldType = this.getFieldType(fieldName);
      } catch (NoSuchFieldException nsfe) {
        log.warn("Field \"" + fieldName + "\" does not exist. Skipping.");
      }
    }
    return fieldType;
  }


  private Object determineValue(String rawValue, String fieldName, Class<?> fieldType, String operator, SpecificationsBuilder<T> builder) {
    Object value = null;
    if (fieldType.getSimpleName().equals("String")) {
      value = rawValue + (("~".equals(operator)) ? SearchOperation.WILDCARD : "");
    } else {
      try {
        value = this.mapStringValueToObject(fieldType, rawValue);
      } catch (Exception e) {
        if (!fieldType.getSimpleName().equals("LocalDate")) {
          log.warn("Unable to translate value \"" + rawValue + "\" to " + fieldType.getSimpleName() + ". Skipping.");
          return null;
        }
      }
    }

    if (value == null && fieldType.getSimpleName().equals("LocalDate")) {
      value = this.partialDate(rawValue);
    }
    return value;
  }


  @Getter
  @Setter
  static class DateRange {
    DateRange(LocalDate start, LocalDate end) {
      setStart(start);
      setEnd(end);
    }

    LocalDate start;
    LocalDate end;
  }


  private DateRange partialDate(String rawValue) {

    if (YEAR_PATTERN.matcher(rawValue).matches()) {
      int year = Integer.parseInt(rawValue);
      log.debug("Match on a partial date (year) " + year);

      return new DateRange(LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));
    }

    if (YEAR_MONTH_PATTERN.matcher(rawValue).matches()) {
      String[] parts = rawValue.split("-");
      int year = Integer.parseInt(parts[0]);
      int month = Integer.parseInt(parts[1]);
      YearMonth ym = YearMonth.of(year, month);
      log.debug("Match on a partial date (year-month combination) " + ym.toString());

      return new DateRange(ym.atDay(1), ym.atEndOfMonth());
    }

    if (MONTH_DAY_PATTERN.matcher(rawValue).matches()) {
      String[] parts = rawValue.split("-");
      int month = Integer.parseInt(parts[0]);
      int day = Integer.parseInt(parts[1]);
      LocalDate tst = LocalDate.of(2004, month, day);
      log.debug("Match on a partial date (month-day combination) " + rawValue + ". Unimplemented, skipping");
      return null;
    }
    return null;
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


  private Class<?> getFieldType(Class<?> type, String fieldName) throws NoSuchFieldException {
    final Field field = type.getDeclaredField(fieldName);
    final Class<?> valueType = field.getType();
    log.debug("Found field named \"" + field.getName() + "\" with type \"" + valueType.getSimpleName() + "\"");
    return valueType;
  }


  private Class<?> getFieldType(String fieldName) throws NoSuchFieldException {
    return this.getFieldType(genericType, fieldName);
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
