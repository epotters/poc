package poc.core.domain;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class UserAccount implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String mail;

  private String username;
  @JsonIgnore
  private String password;
  private String displayName;

  private LocalDate expiryDate = LocalDate.of(2018, 3, 23);
  private boolean enabled = true;
  private LocalDate credentialsExpiryDate = LocalDate.of(2018, 3, 23);
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


  public Collection<UserRole> getAuthorities() {
    return this.authorities;
  }


  public void addAuthority(UserRole authority) {
    if (!authorities.contains(authority)) {
      authorities.add(authority);
    }
  }
}
