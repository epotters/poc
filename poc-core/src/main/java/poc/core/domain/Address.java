package poc.core.domain;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
class Address implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name="address_line")
  private String addressLine;
  private String street;
  private int number;

  @Column(name="number_addition")
  private String numberAddition;

  @Column(name="postal_code")
  private String postalCode;
  private String place;

  @Column(name="country_code")
  private String countryCode;
  private String country;

}
