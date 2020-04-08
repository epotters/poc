package poc.web.api.controller.common;


import org.springframework.data.jpa.domain.Specification;


public interface FilterTranslator<T> {

  Specification<T> translate(final String filtersAsText);

}
