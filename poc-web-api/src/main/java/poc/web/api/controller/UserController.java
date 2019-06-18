package poc.web.api.controller;


import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/users")
public class UserController {

  private static final Log LOG = LogFactory.getLog(UserController.class);

  private static final String NO_AUTHENTICATION = "No authentication found";
  private static final String ANONYMOUS_USER = "User is not authenticated (Anounymous user)";
  private static final String AUTHENTICATED_USER = "Authenticated user";


  @Autowired
  UserController() {
  }


  @RequestMapping("/me")
  public DefaultOidcUser getMe(Authentication authentication) {

    if (authentication == null) {
      LOG.debug(NO_AUTHENTICATION);
      return null;
    } else if (!authentication.isAuthenticated()) {
      LOG.debug(ANONYMOUS_USER);
      return null;
    } else {
      String currentUserName = authentication.getName();
      DefaultOidcUser user = (DefaultOidcUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


      LOG.debug(AUTHENTICATED_USER + " (\"" + currentUserName + "\")");

      LOG.debug(AUTHENTICATED_USER + " (\"" + user.toString() + "\")");

      return user;
    }
  }


}
