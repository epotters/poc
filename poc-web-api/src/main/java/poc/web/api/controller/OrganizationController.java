package poc.web.api.controller;


import java.io.IOException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Employee;
import poc.core.domain.Organization;
import poc.core.repository.OrganizationRepository;


@Slf4j
@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

  private final OrganizationRepository organizationRepository;

  private QuerystringFilterTranslator<Organization> filterTanslator = new QuerystringFilterTranslator<>();

  @Autowired
  OrganizationController(OrganizationRepository organizationRepository) {
    this.organizationRepository = organizationRepository;
  }


  @GetMapping("/")
  public Iterable<Organization> listOrganizations(final Pageable pageable,
      @RequestParam(value = "filters", required = false) final String filters) {

    log.debug("filterParam: " + filters);

    if (filters != null & !"".equals(filters)) {
      Specification<Organization> spec = filterTanslator.translate(filters);
      return organizationRepository.findAll(spec, pageable);
    } else {
      log.debug("No filters provided");
      return organizationRepository.findAll(pageable);
    }
  }

  @GetMapping("/{id}")
  public Organization getOrganization(@PathVariable final Long id) {
    log.info("About to return organization with id: " + id);
    return organizationRepository.getOne(id);
  }

  @PutMapping("/")
  public Organization createOrganization(@RequestBody final Organization organization) {
    return organizationRepository.save(organization);
  }


  @PostMapping("/{id}")
  public Organization updateOrganization(@PathVariable final Long id, @RequestBody final Organization organization) {
    return organizationRepository.save(organization);
  }

  @DeleteMapping("/{id}")
  public void deleteOrganization(@PathVariable final Long id) {
    final Organization organization = organizationRepository.getOne(id);
    organizationRepository.delete(organization);
  }

  @GetMapping("/{id}/employees")
  public Iterable<Employee> findEmployees(@PathVariable final Long id) throws IOException {
    final Organization organization = organizationRepository.getOne(id);
    return organization.getEmployees();
  }

  @GetMapping("/schema")
  public String schema() throws IOException {
    JsonSchemaGenerator generator = new JsonSchemaGenerator();
    return generator.generate(Organization.class);
  }
}
