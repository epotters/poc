package poc.rest.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Greeting;
import poc.core.service.GreetingService;

@RestController
public class GreetingController {

  private GreetingService greetingService;

  @RequestMapping("/greeting")
  public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
    return greetingService.getGreeting(name);
  }
}
