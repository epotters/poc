package poc.web.api.controller;


import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import poc.core.domain.Country;
import poc.core.service.CountryService;
import poc.core.service.impl.GreetingGenerator;
import poc.web.api.controller.common.MessageContainer;
import poc.web.api.service.LocalizedMessageService;


@RestController
@RequestMapping("/api")
public class PocController {

  private final CountryService countryService;
  private final LocalizedMessageService messageService;


  @Autowired
  public PocController(
      CountryService countryService,
      LocalizedMessageService messageService) {
    this.countryService = countryService;
    this.messageService = messageService;
  }


  @RequestMapping("/welcome")
  @ResponseBody
  public MessageContainer home() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    MessageContainer container = new MessageContainer();
    container.setMessage(buildWelcomeMessage(username));
    return container;
  }


  private String buildWelcomeMessage(String userName) {
    StringBuilder messageBuilder = new StringBuilder();
    String greetingKey = GreetingGenerator.generateGreeting();
    messageBuilder.append(messageService.getMessage(greetingKey)).append(" ").append(userName).append(", ");
    messageBuilder.append(messageService.getMessage("greeting.welcome").toLowerCase());
    messageBuilder.append(" op deze site");
    return messageBuilder.toString();
  }


  @RequestMapping("/countries")
  public List<Country> listCountries() {
    return countryService.getCountries();
  }


  @PostMapping("/list-params")
  @ResponseBody
  public String formLister(HttpServletRequest request) {
    Map<String, String[]> map = request.getParameterMap();
    for (Map.Entry<String, String[]> entry : map.entrySet()) {
      System.out.println(entry.getKey() + ":" + entry.getValue()[0]);
    }
    return "OK";
  }

}
