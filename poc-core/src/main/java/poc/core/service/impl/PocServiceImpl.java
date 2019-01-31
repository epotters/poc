package poc.core.service.impl;


import org.springframework.boot.context.properties.EnableConfigurationProperties;

import poc.core.config.CustomProperties;
import poc.core.service.PocService;



@EnableConfigurationProperties(CustomProperties.class)
public class PocServiceImpl implements PocService {

}
