package poc.core.service.impl;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import poc.core.domain.Account;
import poc.core.service.SecurityService;

@Component
public class SecurityServiceImpl implements SecurityService {

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    Account account = new Account();
    account.setUsername(username);
    return account;

  }

}
