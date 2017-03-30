package poc.core.domain;


import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Created by epotters on 2014-09-22
 */

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
class Company implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String name;

  @OneToMany(mappedBy = "employer")
  private List<Employee> employees;


  @OneToMany(mappedBy = "company")
  private List<Establishment> establishments;

}
