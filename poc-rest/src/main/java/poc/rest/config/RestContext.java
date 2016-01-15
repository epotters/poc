package poc.rest.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import poc.core.config.CoreContext;


/**
 * Created by epotters on 2016-01-07
 */

@Configuration
@Import({ CoreContext.class })
@ComponentScan(basePackages = {"poc.rest.controller"})
public class RestContext {


}
