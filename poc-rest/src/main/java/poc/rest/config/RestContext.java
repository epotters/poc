package poc.rest.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;


/**
 * Created by epotters on 2016-01-07
 */

@Configuration
@ComponentScan(basePackages = {"poc.rest.controller"})
public class RestContext {


}
