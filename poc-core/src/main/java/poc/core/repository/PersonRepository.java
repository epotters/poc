package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import poc.core.domain.Person;


/**
 * Created by epotters on 6-11-2014.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long>, Serializable {

  List<Person> findByLastName(String lastName);

}
