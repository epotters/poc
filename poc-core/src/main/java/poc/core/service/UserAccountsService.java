package poc.core.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import poc.core.domain.UserAccount;


public interface UserAccountsService extends UserDetailsService {

  UserAccount loadUserAccountByUsername(String username) throws UsernameNotFoundException;
}
