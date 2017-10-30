package poc.rest.config;


import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class AuthenticationManagerConfiguration extends GlobalAuthenticationConfigurerAdapter {

  private final UserDetailsService userAccountsService;
  private final PasswordEncoder passwordEncoder;


  AuthenticationManagerConfiguration( //
      @Qualifier("userAccountsServicePropertiesImpl") UserDetailsService userAccountsService, //
      PasswordEncoder passwordEncoder) {
    this.userAccountsService = userAccountsService;
    this.passwordEncoder = passwordEncoder;
  }


  @Override
  public void init(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userAccountsService) //
        .passwordEncoder(passwordEncoder);
  }

}
