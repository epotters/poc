package poc.core.repository.specification;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SearchCriteria {

  private String key;
  private SearchOperation operation;
  private Object value;


  SearchCriteria(String key, SearchOperation operation, Object value) {
    setKey(key);
    setOperation(operation);
    setValue(value);
  }
}
