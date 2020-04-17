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


  @Query("SELECT new poc.core.repository.statistics.GenderGroup(p.gender, COUNT(p.gender))"
      + " FROM Person AS p GROUP BY p.gender ORDER BY p.gender ASC")
  List<GenderGroup> countTotalPeopleByGenderClass();


//  @Query("SELECT new poc.core.repository.statistics.AgeGroup(p.birthDate, COUNT(p.birthDate))"
//      + " FROM Person AS p GROUP BY p.birthDate ORDER BY p.birthDate DESC")
//  List<AgeGroup> countTotalPeopleByAgeClass();

  @Query(value =
      "SELECT (DATEDIFF('YEAR', birth_date, now()) - MOD(DATEDIFF('YEAR', birth_date, now()), 10)) as age_group, " +
          "count(id) as number FROM person GROUP BY age_group ORDER BY age_group DESC", nativeQuery = true)
  List<AgeGroup> countTotalPeopleByAgeClass();

}
