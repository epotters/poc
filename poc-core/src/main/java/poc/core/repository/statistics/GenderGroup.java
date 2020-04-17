package poc.core.repository.statistics;


import lombok.AllArgsConstructor;
import lombok.Data;
import poc.core.domain.Gender;


@Data
@AllArgsConstructor
public class GenderGroup {
  private Gender gender;
  private Long number;
}
