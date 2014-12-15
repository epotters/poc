package poc.core.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;


/**
 * Created by epotters on 6-11-2014.
 */

@Entity
public class Person {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String firstName;
  private String prefix;
  private String lastName;

  private String gender;

  private Date birthDate;
  private String birthPlace;


  public Long getId() {
    return id;
  }


  public void setId(Long id) {
    this.id = id;
  }


  public String getFirstName() {
    return firstName;
  }


  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }


  public String getPrefix() {
    return prefix;
  }


  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }


  public String getLastName() {
    return lastName;
  }


  public void setLastName(String lastName) {
    this.lastName = lastName;
  }


  public String getGender() {
    return gender;
  }


  public void setGender(String gender) {
    this.gender = gender;
  }


  public Date getBirthDate() {
    return birthDate;
  }


  public void setBirthDate(Date birthDate) {
    this.birthDate = birthDate;
  }


  public String getBirthPlace() {
    return birthPlace;
  }


  public void setBirthPlace(String birthPlace) {
    this.birthPlace = birthPlace;
  }
}
