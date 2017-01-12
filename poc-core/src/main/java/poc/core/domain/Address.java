package poc.core.domain;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Created by epotters on 2016-01-07
 */

@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
public class Address implements Serializable {

  @Id
  @GeneratedValue
  @Column(name = "id")
  private Long id;

  private String addressLine;
  private String street;
  private int number;
  private String number_addition;
  private String postalCode;
  private String place;
  private String country;

}
