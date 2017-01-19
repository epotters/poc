package poc.core.service.impl;


import java.util.concurrent.atomic.AtomicLong;

import poc.core.domain.Greeting;
import poc.core.service.GreetingService;


public class GreetingServiceImpl implements GreetingService {

  private static final String template = "Hello, %s!";
  private final AtomicLong counter = new AtomicLong();


  public Greeting getGreeting(String name) {

    return new Greeting(counter.incrementAndGet(), GreetingGenerator.generate() + " " + String.format(template, name));
  }
}
