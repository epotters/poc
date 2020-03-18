package poc.core.repository.specification;


import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;


public class NestedSpecification<T> implements Specification<T> {

  private SearchCriteria criteria;
  private String nestedObjectFieldName;


  NestedSpecification(SearchCriteria criteria, String nestedObjectFieldName) {
    this.criteria = criteria;
    this.nestedObjectFieldName = nestedObjectFieldName;
  }


  @Override
  public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

    switch (criteria.getOperation()) {
      case EQUALITY:
        return builder.equal(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue());
      case NEGATION:
        return builder.notEqual(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue());
      case GREATER_THAN:
        if (criteria.getValue() instanceof Comparable) {
          return builder.greaterThan(root.join(nestedObjectFieldName).get(criteria.getKey()), (Comparable) criteria.getValue());
        } else {
          return builder.greaterThan(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue().toString());
        }
      case LESS_THAN:
        if (criteria.getValue() instanceof Comparable) {
          return builder.lessThan(root.join(nestedObjectFieldName).get(criteria.getKey()), (Comparable) criteria.getValue());
        } else {
          return builder.lessThan(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue().toString());
        }
      case LIKE:
        return builder.like(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue().toString());
      case STARTS_WITH:
        return builder.like(root.join(nestedObjectFieldName).get(criteria.getKey()), criteria.getValue() + SearchOperation.WILDCARD);
      case ENDS_WITH:
        return builder.like(root.join(nestedObjectFieldName).get(criteria.getKey()), SearchOperation.WILDCARD + criteria.getValue());
      case CONTAINS:
        return builder
            .like(root.join(nestedObjectFieldName).get(criteria.getKey()), SearchOperation.WILDCARD + criteria.getValue() + SearchOperation.WILDCARD);
      default:
        return null;
    }
  }

}
