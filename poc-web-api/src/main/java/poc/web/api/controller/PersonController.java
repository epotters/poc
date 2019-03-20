package poc.web.api.controller;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import poc.core.domain.Person;
import poc.core.repository.PersonRepository;
import poc.core.repository.specification.SearchOperation;
import poc.core.repository.specification.SpecificationsBuilder;


@Slf4j
@RestController
@RequestMapping("/api/people")
public class PersonController {

  private final PersonRepository personRepository;


  @Autowired
  PersonController(PersonRepository personRepository) {
    this.personRepository = personRepository;
  }


  @RequestMapping("/{id}")
  public Person getPerson(@PathVariable Long id) {
    return personRepository.getOne(id);
  }


  // page, size and sort parameters are supported by default
  // https://stackoverflow.com/questions/33953287/spring-boot-rest-webservice-jpa-pageable-and-filter
  // ?page=1&size=100&sort=firstName,asc&filters=firstName~jaco,lastName~bijk
  @CrossOrigin(origins = "http://localhost:9999")
  @RequestMapping("/")
  public Iterable<Person> listPeople(Pageable pageable,
      @RequestParam(value = "filters", required = false) final String filters) {

    log.debug("filters: " + filters);

    if (filters != null & !"".equals(filters)) {
      SpecificationsBuilder<Person> builder = new SpecificationsBuilder<>();

      String operationSetExpr = "(" + String.join("|", SearchOperation.SIMPLE_OPERATION_SET) + ")";


//      String[] labelValueParts = filters.split(",");
//      for (String labelValue : labelValueParts) {
//
//        if(!"".equals(labelValue)) {
//
//          labelValue.split(operationSetExpr);
//        }
//
//      }


      Pattern pattern = Pattern
//          .compile("(\\w+?)(" + operationSetExpr + ")(\\p{Punct}?)(\\w+?)(\\p{Punct}?),", Pattern.UNICODE_CHARACTER_CLASS);
          .compile("(\\w+?)" + operationSetExpr + "(\\w+?),", Pattern.UNICODE_CHARACTER_CLASS);

      Matcher matcher = pattern.matcher(filters);
      while (matcher.find()) {
//        builder.with(matcher.group(1), matcher.group(2), matcher.group(4), matcher.group(3), matcher.group(5));
        builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
      }

      Specification<Person> spec = builder.build();
      return personRepository.findAll(spec, pageable);
    }
    else {
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
