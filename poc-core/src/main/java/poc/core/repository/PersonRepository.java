package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import poc.core.domain.Person;


@Repository
public interface PersonRepository extends JpaRepository<Person, Long>, Serializable, JpaSpecificationExecutor<Person> {

  List<Person> findByLastName(String lastName);

}
