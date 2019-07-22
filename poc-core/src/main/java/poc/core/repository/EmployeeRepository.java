package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import poc.core.domain.Employee;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, Serializable, JpaSpecificationExecutor<Employee> {


  List<Employee> findByEmployerId(Long employerId);

  List<Employee> findByPersonId(Long personId);


}
