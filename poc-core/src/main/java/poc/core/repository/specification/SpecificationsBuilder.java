package poc.core.repository.specification;


import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;


@Slf4j
public class SpecificationsBuilder<T> {

  private final List<SearchCriteria> params;

  public SpecificationsBuilder() {
    params = new ArrayList<>();
  }


  public SpecificationsBuilder<T> with(String key, String operation, Object value) {
    SearchOperation op = SearchOperation.getSimpleOperation(operation.charAt(0));
    if (op != null) {
      params.add(new SearchCriteria(key, op, value));
    }
    return this;
  }


  public SpecificationsBuilder<T> with(String key, String operation, Object value, String prefix, String suffix) {
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
      if (param.getKey().contains(".")) {
        String[] fieldNames = param.getKey().split("\\.");
        if (fieldNames.length != 2) {
          log.warn("Only one level of nesting is supported. Skipping \"" + param.getKey() + "\"");
          continue;
        }
        param.setKey(fieldNames[1]);
        specs.add(new NestedSpecification<>(param, fieldNames[0]));
      } else {
        specs.add(new BaseSpecification<>(param));
      }
    }
    Specification<T> result = specs.get(0);
    for (Specification<T> spec : specs) {
      result = Specification.where(result).and(spec);
    }
    return result;
  }

}
