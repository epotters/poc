package poc.core.service;

import poc.core.domain.Greeting;


public interface GreetingService {

  Greeting getGreeting(String name);
}
