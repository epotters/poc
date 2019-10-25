package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import poc.core.domain.Organization;


@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>, Serializable, JpaSpecificationExecutor<Organization> {

  List<Organization> findByName(String name);

}
