package poc.core.domain;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * Created by epotters on 2017-03-28
 */
@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
class Employee extends Person {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "company_id")
  private Company employer;

}
