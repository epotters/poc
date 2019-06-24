package authorization.service;


import java.util.List;

import authorization.domain.UserAccount;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public interface UserAccountsService extends UserDetailsService {

  List<UserAccount> findAll();

  UserAccount loadUserAccountByUsername(String username) throws UsernameNotFoundException;
}
