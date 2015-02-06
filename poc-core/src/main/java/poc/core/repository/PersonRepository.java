package poc.core.repository;


import poc.core.model.Person;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


/**
 * Created by epotters on 6-11-2014.
 */
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

  List<Person> findByLastName(String name);

}
