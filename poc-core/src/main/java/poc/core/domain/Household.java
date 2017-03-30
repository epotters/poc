package poc.core.domain;


import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Created by epotters on 2017-03-28
 */

@Entity
@Table(name = "household")
@Data
@NoArgsConstructor
class Household {

  @Id
  @GeneratedValue
  @Column(name = "id")
  private Long id;

  @OneToMany(mappedBy = "household")
  private List<Person> members;
}
