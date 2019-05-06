package poc.core.service;


import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import poc.core.domain.UserAccount;


public interface UserAccountsService extends UserDetailsService {

  List<UserAccount> findAll();

  UserAccount loadUserAccountByUsername(String username) throws UsernameNotFoundException;
}
