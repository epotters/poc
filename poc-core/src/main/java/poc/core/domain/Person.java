package poc.core.domain;


import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * Created by epotters on 6-11-2014.
 */


@Entity
@Table(name = "person")
@Data
@NoArgsConstructor
public class Person implements Serializable {


  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String firstName;
  private String prefix;
  private String lastName;

  private Gender gender;

  private LocalDate birthDate;
  private String birthPlace;



  public Person(String firstName, String lastName) {
    setFirstName(firstName);
    setLastName(lastName);
  }

  public Person(String firstName, String lastName, Gender gender, LocalDate birthDate) {
    setFirstName(firstName);
    setLastName(lastName);
    setGender(gender);
    setBirthDate(birthDate);
  }
}
