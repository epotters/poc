package poc.core.domain;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
public class Employment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "employee_id")
  private Person employee;


  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "employer_id")
  private Organization employer;

  private String description;

  private LocalDate startDate;

  private LocalDate endDate;

  public Employment(Person employee, Organization employer, LocalDate startDate, LocalDate endDate) {
    setEmployee(employee);
    setEmployer(employer);
    setStartDate(startDate);
    setEndDate(endDate);
  }

}
