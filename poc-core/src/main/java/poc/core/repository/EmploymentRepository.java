package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import poc.core.domain.Employment;


@Repository
public interface EmploymentRepository extends JpaRepository<Employment, Long>, Serializable, JpaSpecificationExecutor<Employment> {


  List<Employment> findByEmployerId(Long employerId, Pageable pageable);

  List<Employment> findByEmployeeId(Long employeeId, Pageable pageable);

}
