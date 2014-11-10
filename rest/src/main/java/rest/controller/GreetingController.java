package rest.controller;


import epotters.poc.core.model.Greeting;
import epotters.poc.core.service.GreetingService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

  private GreetingService greetingService;

  @RequestMapping("/greeting")
  public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
    return greetingService.getGreeting(name);
  }
}
