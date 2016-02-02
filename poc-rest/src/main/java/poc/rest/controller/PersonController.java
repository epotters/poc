package poc.rest.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Person;
import poc.core.repository.PersonRepository;


@RestController
@RequestMapping("/people")
// @EnableResourceServer
public class PersonController {

  @Autowired
  private PersonRepository personRepository;


  @RequestMapping("/{id}")
  public Person getPerson(@PathVariable Long id) {
    return personRepository.findOne(id);
  }


  // page, size and sort parameters are supported by default
  @RequestMapping
  public Iterable<Person> listPeople(Pageable pageable) {
    Page<Person> persons = personRepository.findAll(pageable);

    return persons;
  }


  // http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
  @RequestMapping(value = "/people", method = RequestMethod.GET)
  HttpEntity<PagedResources<Person>> people(Pageable pageable, PagedResourcesAssembler assembler) {

    Page<Person> people = personRepository.findAll(pageable);

    return new ResponseEntity<PagedResources<Person>>(assembler.toResource(people), HttpStatus.OK);
  }


}
