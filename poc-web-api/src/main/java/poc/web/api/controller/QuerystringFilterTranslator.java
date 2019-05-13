package poc.web.api.controller;


import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.jpa.domain.Specification;
import poc.core.repository.specification.BaseSpecification;
import poc.core.repository.specification.SearchCriteria;
import poc.core.repository.specification.SearchOperation;
import poc.core.repository.specification.SpecificationsBuilder;


class QuerystringFilterTranslator<T> {

  private static final String SEPARATOR = ",";

  private final String operationSetExpr = "(" + String.join("|", SearchOperation.SIMPLE_OPERATION_SET) + ")";

  private final Pattern pattern = Pattern.compile("(\\w+?)" + operationSetExpr + "(\\w+)", Pattern.UNICODE_CHARACTER_CLASS);

  private static final SearchCriteria ALWAYS_TRUE_CRITERIA = new SearchCriteria("1", SearchOperation.EQUALITY, "1");


  public Specification<T> translate(String filterParam) {
    SpecificationsBuilder<T> builder = new SpecificationsBuilder<>();
    String[] labelValueParts = filterParam.split(SEPARATOR);
    Matcher matcher;
    String fieldName;
    for (String labelValue : labelValueParts) {
      if (!"".equals(labelValue)) {
        matcher = pattern.matcher(labelValue);
        if (matcher.find()) {
          fieldName = matcher.group(1);
          builder.with(fieldName, matcher.group(2), matcher.group(3) + SearchOperation.WILDCARD);
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


  // Not prepared for multiple filtes yet
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

}
