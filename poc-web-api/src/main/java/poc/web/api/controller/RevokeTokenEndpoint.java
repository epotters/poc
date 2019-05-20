package poc.web.api.controller;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.provider.endpoint.FrameworkEndpoint;
import org.springframework.security.oauth2.provider.token.ConsumerTokenServices;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


@Slf4j
@FrameworkEndpoint
public class RevokeTokenEndpoint {

  @Resource(name = "tokenServices")
  ConsumerTokenServices tokenServices;

  @RequestMapping(method = RequestMethod.DELETE, value = "/oauth/token")
  @ResponseBody
  public boolean revokeToken(HttpServletRequest request) {

    String authorization = request.getHeader("Authorization");
    if (authorization != null && authorization.contains("Bearer")) {
      log.info("Request has an authorization header and it contains the word Bearer");
      String tokenId = authorization.substring("Bearer".length() + 1);
      return tokenServices.revokeToken(tokenId);
    }
    log.info("Either the request has no authorization header or it does not contain the word Bearer");
    return false;
  }
}
