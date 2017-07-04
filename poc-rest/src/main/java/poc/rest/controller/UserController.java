package poc.rest.controller;


import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import poc.core.service.SecurityService;


@RestController
@RequestMapping("/api/users")
public class UserController {

  private static final Log LOG = LogFactory.getLog(UserController.class);

  private static final String NO_AUTHENTICATION = "No authentication found";
  private static final String ANONYMOUS_USER = "User is not authenticated (Anounymous user)";
  private static final String AUTHENTICATED_USER = "Authenticated user";


  private SecurityService securityService;

  @Autowired
  UserController(SecurityService securityService) {
    this.securityService = securityService;
  }


  @RequestMapping("/me")
  public UserDetails getMe() {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null) {
      LOG.debug(NO_AUTHENTICATION);
      return null;
    }
    else if (!auth.isAuthenticated()) {
      LOG.debug(ANONYMOUS_USER);
      return null;
    }
    else {
      String currentUserName = auth.getName();

      // User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      LOG.debug(AUTHENTICATED_USER + " (\"" + currentUserName + "\")");
      return securityService.loadUserByUsername(currentUserName);
    }
  }

}
