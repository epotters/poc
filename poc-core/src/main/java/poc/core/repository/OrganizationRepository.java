package poc.core.repository;


import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import poc.core.domain.Organization;



@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>, Serializable {

  List<Organization> findByLastName(String lastName);

}
