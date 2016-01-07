package poc.core.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import poc.core.domain.Person;

import java.io.Serializable;
import java.util.List;


/**
 * Created by epotters on 6-11-2014.
 */
@Component
public interface PersonRepository extends JpaRepository<Person, Long>, Serializable {

  List<Person> findByLastName(String lastName);

}
