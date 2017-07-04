package poc.core.service;


import java.util.List;

import poc.core.domain.Organization;


public interface OrganizationService {

  List<Organization> getOrganizations();

  Organization getOrganization(Long id);

  Organization saveOrganization(Organization organization);

  Organization deleteOrganization(Organization organization);

}
