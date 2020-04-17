package poc.core.repository.statistics;


import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class AgeGroup {
  private Long number;
  private int ageGroup;

  AgeGroup(int ageGroup, Long number) {
    this.ageGroup = ageGroup;
    this.number = number;
  }


}
