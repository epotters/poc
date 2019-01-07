package poc.core.service.impl;


import org.springframework.boot.context.properties.EnableConfigurationProperties;

import poc.core.config.CustomProperties;


@EnableConfigurationProperties(CustomProperties.class)
public class PocService {
}
