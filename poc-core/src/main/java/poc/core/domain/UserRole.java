package poc.core.domain;


import org.springframework.security.core.GrantedAuthority;


public enum UserRole implements GrantedAuthority {

  USER, ADMIN, ACTUATOR;

  private String authorityName;



  @Override
  public String getAuthority() {
    return name();
  }

}
