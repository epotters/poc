package poc.core.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


/**
 * Created by epotters on 6-10-2014.
 */
@Entity
public class Employee extends Person {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private Company company;


  public Company getCompany() {
    return company;
  }


  public void setCompany(Company company) {
    this.company = company;
  }
}
