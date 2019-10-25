package authorization.domain;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;


@Data
@NoArgsConstructor
public class UserAccount implements UserDetails {

  private String username;
  private String mail;
  @JsonIgnore
  private String password;
  private String displayName;

  private LocalDate expiryDate = LocalDate.of(2021, 3, 23);
  private boolean enabled = true;
  private LocalDate credentialsExpiryDate = LocalDate.of(2021, 3, 23);
  private boolean locked = false;

  private Collection<UserRole> authorities = new ArrayList<>();


  @Override
  public boolean isAccountNonExpired() {
    return (LocalDate.now().isBefore(expiryDate));
  }


  @Override
  public boolean isAccountNonLocked() {
    return !locked;
  }


  @Override
  public boolean isCredentialsNonExpired() {
    return (LocalDate.now().isBefore(credentialsExpiryDate));
  }


  @Override
  public boolean isEnabled() {
    return enabled;
  }


  @Override
  public Collection<UserRole> getAuthorities() {
    return this.authorities;
  }


  public void addAuthority(UserRole authority) {
    if (!authorities.contains(authority)) {
      authorities.add(authority);
    }
  }
}
