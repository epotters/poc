package poc.core.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import poc.core.model.Person;


/**
 * Created by epotters on 6-11-2014.
 */
@Component
public interface PersonRepository extends JpaRepository<Person, Long> {

}
