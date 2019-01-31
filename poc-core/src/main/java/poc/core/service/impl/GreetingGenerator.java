package poc.core.service.impl;


import java.time.LocalTime;


public class GreetingGenerator {

  static final String GREETING_GROUP = "greeting";
  static final String GOOD_MORNING = "good-morning";
  static final String GOOD_AFTERNOON = "good-afternoon";
  static final String GOOD_EVENING = "good-evening";
  static final String GOOD_NIGHT = "good-night";


  public static String generateGreeting() {
    return GreetingGenerator.generateGreeting(LocalTime.now());
  }


  public static String generateGreeting(LocalTime time) {
    StringBuilder greetingKey = new StringBuilder();
    greetingKey.append(GREETING_GROUP).append(".");
    final int hour = time.getHour();
    if (hour <= 6) {
      greetingKey.append(GOOD_NIGHT);
    } else if (hour <= 12) {
      greetingKey.append(GOOD_MORNING);
    } else if (hour <= 18) {
      greetingKey.append(GOOD_AFTERNOON);
    } else {
      greetingKey.append(GOOD_EVENING);
    }
    return greetingKey.toString();
  }
}