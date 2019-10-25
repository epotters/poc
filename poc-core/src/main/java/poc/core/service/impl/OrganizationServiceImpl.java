package poc.core.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import poc.core.domain.Organization;
import poc.core.repository.OrganizationRepository;
import poc.core.service.OrganizationService;


@Component
@Transactional(propagation = Propagation.REQUIRED)
public class OrganizationServiceImpl implements OrganizationService {

  private OrganizationRepository organizationRepository;


  @Autowired
  OrganizationServiceImpl(OrganizationRepository organizationRepository) {
    this.organizationRepository = organizationRepository;
    assert (organizationRepository != null);
  }


  @Override
  public List<Organization> getOrganizations() {
    return organizationRepository.findAll();
  }


  @Override
  public Organization getOrganization(Long id) {
    return organizationRepository.getOne(id);
  }


  @Override
  public Organization saveOrganization(Organization organization) {
    return organizationRepository.save(organization);
  }


  @Override
  public Organization deleteOrganization(Organization organization) {
    organizationRepository.delete(organization);
    return null;
  }

}
