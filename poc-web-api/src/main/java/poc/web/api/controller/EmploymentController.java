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
import poc.core.domain.Employment;
import poc.core.domain.Organization;
import poc.core.repository.EmploymentRepository;
import poc.core.repository.OrganizationRepository;


@Slf4j
@RestController
@RequestMapping("/api/employments")
public class EmploymentController {

  private final EmploymentRepository employmentRepository;


  private QuerystringFilterTranslator<Employment> employmentFilterTanslator = new QuerystringFilterTranslator<>();


  @Autowired
  EmploymentController(
      OrganizationRepository organizationRepository,
      EmploymentRepository employmentRepository
  ) {
    this.employmentRepository = employmentRepository;
  }

  @GetMapping("/")
  public Iterable<Employment> findAllEmployments(final Pageable pageable,
      @RequestParam(value = "filters", required = false) final String filters) throws IOException {

    if (filters != null & !"".equals(filters)) {
      Specification<Employment> spec = employmentFilterTanslator.translate(filters);
      return employmentRepository.findAll(spec, pageable);
    } else {
      log.debug("No filters provided");
      return employmentRepository.findAll(pageable);
    }
  }

  @GetMapping("/{id}")
  public Employment getEmployment(@PathVariable final Long id) {
    log.info("About to return employment with id: " + id);
    return employmentRepository.getOne(id);
  }


  @PutMapping("/")
  public Employment createEmployment(@RequestBody final Employment employment) {
    return employmentRepository.save(employment);
  }


  @PostMapping("/{id}")
  public Employment updateEmployment(@PathVariable final Long id, @RequestBody final Employment employment) {
    return employmentRepository.save(employment);
  }


  @DeleteMapping("/{id}")
  public void deleteEmployment(@PathVariable final Long id) {
    employmentRepository.deleteById(id);
  }


  //  Schema

  @GetMapping("/schema")
  public String schema() throws IOException {
    JsonSchemaGenerator generator = new JsonSchemaGenerator();
    return generator.generate(Employment.class);
  }
}
