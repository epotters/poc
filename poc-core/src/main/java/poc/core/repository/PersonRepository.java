package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import poc.core.domain.Person;
import poc.core.repository.statistics.AgeGroup;
import poc.core.repository.statistics.GenderGroup;


@Repository
public interface PersonRepository extends JpaRepository<Person, Long>, Serializable, JpaSpecificationExecutor<Person> {

  List<Person> findByLastName(String lastName);

}
