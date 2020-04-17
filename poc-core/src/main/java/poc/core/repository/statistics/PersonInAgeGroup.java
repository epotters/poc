package poc.core.repository.statistics;


import java.time.LocalDate;
import java.time.Period;

import poc.core.domain.Person;


public class PersonInAgeGroup extends Person {
  private int groupSize = 10;

  public int getAge() {
    return Period.between(getBirthDate(), LocalDate.now()).getYears();
  }

  public AgeGroup getAgeGroup() {
    int groupLow = ((this.getAge() - this.getAge() % groupSize));
    int groupHigh = groupLow + groupSize - 1;
    return new AgeGroup(groupLow, 0L);
  }

}
