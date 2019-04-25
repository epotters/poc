package poc.web.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import poc.core.service.impl.GreetingGenerator;
import poc.web.api.service.LocalizedMessageService;


@RestController
@RequestMapping("/")
public class PocController {


  private final LocalizedMessageService messageService;

  @Autowired
  public PocController(LocalizedMessageService messageService) {
    this.messageService = messageService;
  }


  @RequestMapping("/welcome")
  @ResponseBody
  public String home() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return buildWelcomeMessage(username);
  }


  private String buildWelcomeMessage(String userName) {
    StringBuilder messageBuilder = new StringBuilder();
    String greetingKey = GreetingGenerator.generateGreeting();
    messageBuilder.append(messageService.getMessage(greetingKey)).append(" ").append(userName).append(", ");
    messageBuilder.append(messageService.getMessage("greeting.welcome").toLowerCase());
    messageBuilder.append(" op deze site");
    return messageBuilder.toString();
  }
}
