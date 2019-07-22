package poc.core.repository.specification;


import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;


public class SpecificationsBuilder<T> {

  private final List<SearchCriteria> params;


  public SpecificationsBuilder() {
    params = new ArrayList<>();
  }


  public SpecificationsBuilder with(String key, String operation, Object value) {

    String fieldType = this.getFieldTypeForGeneric(key);

    // TODO: Support nested properties
    if (key.contains(".")) {
      throw new UnsupportedOperationException("Nested properties are not supported at this moment");
    }

    SearchOperation op = SearchOperation.getSimpleOperation(operation.charAt(0));
    if (op != null) {
      params.add(new SearchCriteria(key, op, value));
    }
    return this;
  }


  public SpecificationsBuilder with(String key, String operation, Object value, String prefix, String suffix) {

    SearchOperation op = SearchOperation.getSimpleOperation(operation.charAt(0));
    if (op != null) {
      if (op == SearchOperation.EQUALITY) {
        boolean startsWithAsterisk = prefix.contains("*");
        boolean endsWithAsterisk = suffix.contains("*");

        if (startsWithAsterisk && endsWithAsterisk) {
          op = SearchOperation.CONTAINS;
        } else if (startsWithAsterisk) {
          op = SearchOperation.ENDS_WITH;
        } else if (endsWithAsterisk) {
          op = SearchOperation.STARTS_WITH;
        }
      }
      params.add(new SearchCriteria(key, op, value));
    }
    return this;
  }


  public Specification<T> build() {
    if (params.size() == 0) {
      return null;
    }
    List<Specification<T>> specs = new ArrayList<>();
    for (SearchCriteria param : params) {
      specs.add(new BaseSpecification<>(param));
    }
    Specification<T> result = specs.get(0);
    for (Specification<T> spec : specs) {
      result = Specification.where(result).and(spec);
    }
    return result;
  }


  private String getFieldTypeForGeneric(String fieldName) {

    for (Field field : this.getClass().getDeclaredFields()) {
      System.out.format("Type: %s%n", field.getType());
      System.out.format("GenericType: %s%n", field.getGenericType());
      for (Field genericField : field.getGenericType().getClass().getDeclaredFields()) {
        if (genericField.getName().equals(fieldName)) {

          System.out.format("Generic type: %s%n", genericField.getType());

          return genericField.getType().getSimpleName();
        }
      }
    }
    return null;
  }


}
