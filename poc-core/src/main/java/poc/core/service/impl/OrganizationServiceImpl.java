package poc.core.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import poc.core.domain.Organization;
import poc.core.repository.OrganizationRepository;
import poc.core.repository.OrganizationRepository;
import poc.core.service.OrganizationService;
import poc.core.service.OrganizationService;


@Component
public class OrganizationServiceImpl implements OrganizationService {


  private OrganizationRepository organizationRepository;


  @Autowired
  OrganizationServiceImpl(OrganizationRepository organizationRepository) {
    this.organizationRepository = organizationRepository;
    assert(organizationRepository != null);
  }


  @Override
  public List<Organization> getOrganizations() {

    int pageNumber = 5;
    int pageSize = 50;

    Sort sort = new Sort(new Sort.Order(Sort.Direction.ASC, "id"), new Sort.Order(Sort.Direction.DESC, "fullName"));
    PageRequest pageRequest = new PageRequest(pageNumber, pageSize, sort);

    Page<Organization> page = organizationRepository.findAll(pageRequest);
    return page.getContent();
  }


  @Override
  public Organization getOrganization(Long id) {
    return organizationRepository.findOne(id);
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
