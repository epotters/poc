package poc.core.domain;


import org.springframework.security.core.GrantedAuthority;

import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@NoArgsConstructor
public class UserRole implements GrantedAuthority {

  private String authorityName;


  public UserRole(String authorityName) {
    this.authorityName = authorityName;
  }


  @Override
  public String getAuthority() {
    return authorityName;
  }

}
