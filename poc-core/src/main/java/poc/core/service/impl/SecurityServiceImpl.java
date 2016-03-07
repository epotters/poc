package poc.core.service.impl;


import poc.core.domain.Account;
import poc.core.service.SecurityService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


/**
 * Created by epotters on 2-3-2015.
 */
public class SecurityServiceImpl implements SecurityService {

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return new Account();
  }

}
