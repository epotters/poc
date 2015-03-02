package poc.core.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import poc.core.service.SecurityService;


/**
 * Created by epotters on 2-3-2015.
 */
public class SecurityServiceImpl implements SecurityService, UserDetailsService {


  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return null;
  }

}
