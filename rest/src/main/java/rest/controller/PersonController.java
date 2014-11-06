package rest.controller;


import epotters.poc.core.model.Person;
import epotters.poc.core.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PersonController {

  private PersonService personService;

  @RequestMapping("/people/{id}")
  public Person getPerson(@PathVariable Long id){
    return personService.getPerson(id);
  }


  @Autowired(required=true)
  @Qualifier(value="personService")
  public void setPersonService(PersonService personService){
    this.personService = personService;
  }
}
