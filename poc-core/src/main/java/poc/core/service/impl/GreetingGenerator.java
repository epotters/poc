package poc.core.service.impl;


import java.util.Calendar;


/**
 * Created by epotters on 12-2-2015.
 */
public class GreetingGenerator {

  static final String GOOD_MORNING = "Goedemorgen";
  static final String GOOD_AFTERNOON = "Goedemiddag";
  static final String GOOD_EVENING = "Goedenavond";
  static final String GOOD_NIGHT = "Goedenacht";


  public static String generate() {

    String greeting = "";

    Calendar cal = Calendar.getInstance();
    int hour = cal.get(Calendar.HOUR_OF_DAY);

    if (hour < 6) {
      greeting = GOOD_NIGHT;
    }
    else if (hour > 6 && hour <= 12) {
      greeting = GOOD_MORNING;
    }
    else if (hour > 12 && hour <= 18) {
      greeting = GOOD_AFTERNOON;
    }
    else if (hour > 18) {
      greeting = GOOD_EVENING;
    }
    return greeting;
  }
}



