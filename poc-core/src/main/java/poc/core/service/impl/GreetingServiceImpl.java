package poc.core.service.impl;


import poc.core.model.Greeting;
import poc.core.service.GreetingService;

import java.util.concurrent.atomic.AtomicLong;


public class GreetingServiceImpl implements GreetingService {

  private static final String template = "Hello, %s!";
  private final AtomicLong counter = new AtomicLong();


  public Greeting getGreeting(String name) {

    return new Greeting(counter.incrementAndGet(), GreetingGenerator.generate() + " " + String.format(template, name));
  }
}
