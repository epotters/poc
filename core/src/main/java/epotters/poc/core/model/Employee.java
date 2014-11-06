package epotters.poc.core.model;


/**
 * Created by epotters on 6-10-2014.
 */
public class Employee extends Person {

  private Company company;


  public Company getCompany() {
    return company;
  }


  public void setCompany(Company company) {
    this.company = company;
  }
}
