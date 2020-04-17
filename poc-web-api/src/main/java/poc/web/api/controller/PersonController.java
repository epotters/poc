package poc.web.api.controller;


import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Employment;
import poc.core.domain.Person;
import poc.core.repository.EmploymentRepository;
import poc.core.repository.PersonRepository;
import poc.web.api.controller.common.JsonSchemaGenerator;
import poc.web.api.controller.common.QuerystringFilterTranslator;


@Slf4j
@RestController
@RequestMapping("/api/people")
@Transactional(propagation = Propagation.REQUIRED)
public class PersonController {

  private final int batchPageSize = 100;
  private final PersonRepository personRepository;
  private final EmploymentRepository employmentRepository;

  private QuerystringFilterTranslator<Person> filterTanslator = new QuerystringFilterTranslator<>(Person.class);

  @Autowired
  PersonController(
      PersonRepository personRepository,
      EmploymentRepository employmentRepository
  ) {
    this.personRepository = personRepository;
    this.employmentRepository = employmentRepository;
  }

  // page, size and sort parameters are supported by default
  // https://stackoverflow.com/questions/33953287/spring-boot-rest-webservice-jpa-pageable-and-filter
  // ?page=1&size=100&sort=firstName,asc&filters=firstName~jaco,lastName~bijk
  @GetMapping("/")
  public Iterable<Person> listPeople(final Pageable pageable,
      @RequestParam(value = "filters", required = false) final String filters) {

    log.debug("filterParam: " + filters);

    if (filters != null & !"".equals(filters)) {
      Specification<Person> spec = filterTanslator.translate(filters);
      return personRepository.findAll(spec, pageable);
    } else {
      log.debug("No filters provided");
      return personRepository.findAll(pageable);
    }
  }

  @GetMapping("/{id}")
  public Person getPerson(@PathVariable final Long id) {
    log.info("About to return person with id: " + id);
    return personRepository.getOne(id);
  }

  @PutMapping("/")
  public Person createPerson(@RequestBody final Person person) {
    return personRepository.save(person);
  }

  @PostMapping("/{id}")
  public Person updatePerson(@PathVariable final Long id, @RequestBody final Person person) {
    return personRepository.save(person);
  }

  @PatchMapping("/")
  public void updatePeople(@RequestParam(value = "filters", required = true) final String filters,
      final @RequestBody Map<String, Object> partialPerson) {

    // Validate the partial person
    List<String> fieldNamesInFilter = filterTanslator.fieldNames(filters);

    partialPerson.forEach((fieldName, fieldValue) -> {
      Field field = ReflectionUtils.findField(Person.class, fieldName);
      if (field == null) {
        log.error("Field " + fieldName + " does not exist in class person");
        // Return 400 bad request
      }

      if (fieldNamesInFilter.contains(fieldName)) {
        log.error("Field " + fieldName + " is part of the filter an therefor cannot be batch updated (at the moment)");
        // Return 400 bad request
      }
    });


    final Specification<Person> spec = filterTanslator.translate(filters);
    final long numberFound = personRepository.count(spec);
    final long numberOfPages = numberFound / batchPageSize;

    for (int pageNumber = 0; pageNumber < numberOfPages; pageNumber++) {
      Page<Person> peopleToUpdate = personRepository.findAll(spec, PageRequest.of(pageNumber, batchPageSize));
      for (Person personToUpdate : peopleToUpdate) {

        // Patch all people
        partialPerson.forEach((fieldName, fieldValue) -> {
          // use reflection to get field k on manager and set it to value k
          Field field = ReflectionUtils.findField(Person.class, fieldName);
          if (field != null) {
            ReflectionUtils.setField(field, personToUpdate, fieldValue);
          }
        });
      }

      personRepository.saveAll(peopleToUpdate);
      personRepository.flush();
    }
  }

  @DeleteMapping("/{id}")
  public void deletePerson(@PathVariable final Long id) {
    final Person person = personRepository.getOne(id);
    employmentRepository.deleteByEmployeeId(person.getId());
    personRepository.delete(person);
  }


  @DeleteMapping("/")
  public void deletePeople(@RequestParam(value = "filters", required = true) final String filters) {

    final Specification<Person> spec = filterTanslator.translate(filters);
    final long numberFound = personRepository.count(spec);
    final long numberOfPages = numberFound / batchPageSize;

    for (int pageNumber = 0; pageNumber < numberOfPages; pageNumber++) {
      Page<Person> peopleToDelete = personRepository.findAll(spec, PageRequest.of(pageNumber, batchPageSize));
      personRepository.deleteAll(peopleToDelete);
      personRepository.flush();
    }
  }


  @GetMapping("/{id}/employers")
  public Iterable<Employment> findEmployers(@PathVariable final Long id, final Pageable pageable) {
    return employmentRepository.findByEmployeeId(id, pageable);
  }


  @GetMapping("/schema")
  public String schema() throws IOException {
    final JsonSchemaGenerator generator = new JsonSchemaGenerator();
    return generator.generate(Person.class);
  }

}
