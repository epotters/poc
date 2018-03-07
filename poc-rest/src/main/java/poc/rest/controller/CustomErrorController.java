package poc.rest.controller;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;


/**
 * <p>
 * Based on the helpful answer at http://stackoverflow.com/q/25356781/56285,
 * with error details in response body added.
 *
 * @author Joni Karppinen
 * @since 20.2.2015
 */
@RestController
public class CustomErrorController implements ErrorController {

  private static final String PATH = "/error";

  private final ErrorAttributes errorAttributes;


  @Autowired
  public CustomErrorController(ErrorAttributes errorAttributes) {
    Assert.notNull(errorAttributes, "ErrorAttributes must not be null");
    this.errorAttributes = errorAttributes;
  }


  @RequestMapping(value = PATH)
  ErrorResponseBody error(HttpServletRequest request, HttpServletResponse response) {
    // Appropriate HTTP response code (e.g. 404 or 500) is automatically set by Spring.
    // Here we just define response body.
    return new ErrorResponseBody(response.getStatus(), getErrorAttributes(request, true));
  }


  @Override
  public String getErrorPath() {
    return PATH;
  }


  private Map<String, Object> getErrorAttributes(HttpServletRequest request, boolean includeStackTrace) {
    ServletWebRequest servletWebRequest = new ServletWebRequest(request);
    return errorAttributes.getErrorAttributes(servletWebRequest, includeStackTrace);
  }
}