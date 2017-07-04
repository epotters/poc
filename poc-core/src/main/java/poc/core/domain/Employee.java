package poc.core.domain;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
class Employee extends Person {

  private Organization employer;

}
