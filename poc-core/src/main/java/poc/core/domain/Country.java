package poc.core.domain;


import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class Country {
  private String code;
  private String displayName;
}
