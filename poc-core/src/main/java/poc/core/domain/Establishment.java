package poc.core.domain;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * (Dutch translation: Vestiging)
 */
@Entity
@Table(name = "establishment")
@Data
@NoArgsConstructor
class Establishment implements Addressable, Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organization_id")
  private Organization organization;

  @OneToOne
  private Address address;
}
