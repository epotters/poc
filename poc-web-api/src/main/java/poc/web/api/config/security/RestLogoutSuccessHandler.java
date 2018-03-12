package poc.web.api.config.security;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;


@Component("restLogoutSuccessHandler")
public class RestLogoutSuccessHandler implements LogoutSuccessHandler {

  private static final Log LOG = LogFactory.getLog(RestLogoutSuccessHandler.class);


  @Override
  public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException, ServletException {

    String msg = "Logged out" + ((authentication != null) ? " as user \"" + authentication.getName() + "\"" : "");
    LOG.info(msg);

    response.setStatus(HttpStatus.OK.value());
    response.getWriter().flush();
  }
}
