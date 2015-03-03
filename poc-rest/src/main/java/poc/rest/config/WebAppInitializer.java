package poc.rest.config;


import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import poc.rest.Application;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;


/**
 * Created by epotters on 15-12-2014.
 */
public class WebAppInitializer implements WebApplicationInitializer {

  @Override
  public void onStartup(ServletContext servletContext) throws ServletException {
    AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
    ctx.register(Application.class);
    ctx.setServletContext(servletContext);
    Dynamic dynamic = servletContext.addServlet("dispatcher", new DispatcherServlet(ctx));
    dynamic.addMapping("/");
    dynamic.setLoadOnStartup(1);
  }

}
