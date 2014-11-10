package epotters.poc.core.service.impl;


import epotters.poc.core.model.Greeting;
import epotters.poc.core.service.GreetingService;

import java.util.concurrent.atomic.AtomicLong;


public class GreetingServiceImpl implements GreetingService {

  private static final String template = "Hello, %s!";
  private final AtomicLong counter = new AtomicLong();

  public Greeting getGreeting(String name) {

    return new Greeting(counter.incrementAndGet(), String.format(template, name));
  }
}
