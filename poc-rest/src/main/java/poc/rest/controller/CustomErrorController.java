package poc.rest.controller;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;


/**
 * Based on the helpful answer at http://stackoverflow.com/q/25356781/56285,
 * with error details in response body added.
 *
 * @author Joni Karppinen
 * @since 20.02.2015
 */
@RestController
public class CustomErrorController implements ErrorController {

  private static final Log LOG = LogFactory.getLog(CustomErrorController.class);

  private static final String ERROR_PATH = "/error";

  private final ErrorAttributes errorAttributes;


  @Autowired
  public CustomErrorController(ErrorAttributes errorAttributes) {
    Assert.notNull(errorAttributes, "ErrorAttributes must not be null");
    this.errorAttributes = errorAttributes;

    LOG.info("Error attributes (controller): " + this.errorAttributes);
  }


  @RequestMapping(value = ERROR_PATH)
  ErrorResponseBody error(HttpServletRequest request, HttpServletResponse response) {
    final Map<String, Object> errorAttributesMap = errorAttributes.getErrorAttributes(new ServletWebRequest(request), true);

    LOG.info("Response status: " + response.getStatus());
    LOG.info("Error attributes (error path handler): " + errorAttributesMap);

    return new ErrorResponseBody(response.getStatus(), errorAttributesMap);
  }


  @Override
  public String getErrorPath() {
    return ERROR_PATH;
  }
}
