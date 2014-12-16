package poc.rest.controller;


import poc.core.model.Person;
import poc.core.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PersonController {

  @Autowired
  private PersonService personService;

  @RequestMapping("/people/{id}")
  public Person getPerson(@PathVariable Long id){
    return personService.getPerson(id);
  }

}
