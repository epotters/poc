package poc.core.domain;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Created by epotters on 2017-03-28
 *
 * (Dutch translation: Vestiging)
 */
@Entity
@Table(name = "establishment")
@Data
@NoArgsConstructor
class Establishment {

  @Id
  @GeneratedValue
  @Column(name = "id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "conmpany_id")
  private Company company;

  @OneToOne
  private Address address;
}
