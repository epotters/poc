package poc.web.api.config.security;


import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


/*
Source: https://stackoverflow.com/questions/37516755/spring-boot-rest-service-options-401-on-oauth-token
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

  @Override
  public void init(FilterConfig fc) throws ServletException {
  }

  @Override
  public void doFilter(ServletRequest req, ServletResponse resp,
      FilterChain chain) throws IOException, ServletException {
    HttpServletResponse response = (HttpServletResponse) resp;
    HttpServletRequest request = (HttpServletRequest) req;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, authorization, credential, x-requested-with, X-XSRF-TOKEN");

    // log.info("Parameters: " + listParameters(request));

    /* Always return OK for requests using request method OPTIONS */
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      response.setStatus(HttpServletResponse.SC_OK);
    } else {
      chain.doFilter(req, resp);
    }

  }

  @Override
  public void destroy() {
  }


  private String listParameters(HttpServletRequest request) {
    return request.getParameterMap().entrySet().stream().map((entry) -> {
      return entry.getKey() + ":" + Arrays.toString(entry.getValue());
    }).collect(Collectors.joining(", "));
  }

}
