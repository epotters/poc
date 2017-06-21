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


@Entity
@Table(name = "organization")
@Data
@NoArgsConstructor
public class Organization implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String name;

  // @OneToMany(mappedBy = "employer")
  // private List<Employee> employees;


  @OneToMany(mappedBy = "organization")
  private List<Establishment> establishments;

}
