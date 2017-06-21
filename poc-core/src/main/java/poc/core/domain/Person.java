package poc.core.domain;


import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "person")
@Data
@NoArgsConstructor
public class Person implements Serializable {

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  private String firstName;
  private String prefix;
  private String lastName;

  @Enumerated(EnumType.STRING)
  private Gender gender;

  @Column(columnDefinition = "DATE")
  private LocalDate birthDate;
  private String birthPlace;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "household_id")
  private Household household;


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
