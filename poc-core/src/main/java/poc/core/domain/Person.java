package poc.core.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;


/**
 * Created by epotters on 6-11-2014.
 */

@Entity
@Getter
@Setter
@ToString
public class Person {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String firstName;
  private String prefix;
  private String lastName;

  private Gender gender;

  private Date birthDate;
  private String birthPlace;

  public Person() {
  }


  public Person(String firstName, String lastName) {
    this.lastName = lastName;
    this.firstName = firstName;
  }
}
