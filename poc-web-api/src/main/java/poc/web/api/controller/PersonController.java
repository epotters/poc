package poc.web.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import poc.core.domain.Person;
import poc.core.repository.PersonRepository;


@RestController
@RequestMapping("/api/people")
public class PersonController {

  private PersonRepository personRepository;

  @Autowired
  PersonController(PersonRepository personRepository) {
    this.personRepository = personRepository;
  }


  @RequestMapping("/{id}")
  public Person getPerson(@PathVariable Long id) {
    return personRepository.getOne(id);
  }


/*
{
  "sort": {
    "columnId": "firstName",
    "direction": "desc"
  },
  "filter": {
    "lastName": "bijke",
    "firstName": "jac"
  },
  "offset": 0,
  "size": 100
}
   */
  // page, size and sort parameters are supported by default


  // https://stackoverflow.com/questions/33953287/spring-boot-rest-webservice-jpa-pageable-and-filter

  @CrossOrigin(origins = "http://localhost:9999")
  @RequestMapping("/")
  public Iterable<Person> listPeople(Pageable pageable) {
  //public Page<Person> listPeople(PageableDojoFetchOptions pageableDojoFetchOptions) {

    // PersonSpecification spec = new PersonSpecification(sfilters);

    personRepository.findAll(pageable);
    return personRepository.findAll(pageable);
  }


  // http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
  @RequestMapping(method = RequestMethod.GET)
  HttpEntity<PagedResources<Person>> people(Pageable pageable, PagedResourcesAssembler assembler) {

    Page<Person> people = personRepository.findAll(pageable);

    return new ResponseEntity<>(assembler.toResource(people), HttpStatus.OK);
  }

}
