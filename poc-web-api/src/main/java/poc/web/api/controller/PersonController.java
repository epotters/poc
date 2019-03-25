package poc.web.api.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Person;
import poc.core.repository.PersonRepository;


@CrossOrigin(origins = "http://localhost:9999")
@Slf4j
@RestController
@RequestMapping("/api/people")
public class PersonController {

  private final PersonRepository personRepository;

  private QuerystringFilterToSpecificationTranslator<Person> filterTanslator = new QuerystringFilterToSpecificationTranslator<>();


  @Autowired
  PersonController(PersonRepository personRepository) {
    this.personRepository = personRepository;
  }


  @GetMapping("/{id}")
  public Person getPerson(@PathVariable final Long id) {
    return personRepository.getOne(id);
  }

  @PostMapping("/{id}")
  public Person updatePerson(@PathVariable final Long id, @RequestBody final Person person) {
    return personRepository.save(person);
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


  // http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
  @RequestMapping(method = RequestMethod.GET)
  HttpEntity<PagedResources<Person>> people(Pageable pageable, PagedResourcesAssembler assembler) {

    Page<Person> people = personRepository.findAll(pageable);

    return new ResponseEntity<>(assembler.toResource(people), HttpStatus.OK);
  }

}
