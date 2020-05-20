package poc.web.api.config;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(CorsProperties.class)
@Import(SecurityProblemSupport.class)
public class ResourceServerConfig extends WebSecurityConfigurerAdapter { // extends ResourceServerConfigurerAdapter {

  private final CorsProperties corsProperties;

  @Autowired
  public ResourceServerConfig(CorsProperties corsProperties) {
    this.corsProperties = corsProperties;
  }

  @Autowired
  private SecurityProblemSupport problemSupport;

  /*
  https://docs.spring.io/spring-security/site/docs/5.2.x/api/org/springframework/security/config/annotation/web/configurers/oauth2/server/resource/OAuth2ResourceServerConfigurer.html
   */
  @Override
  public void configure(HttpSecurity http) throws Exception {

    // @formatter:off
    http
        .cors(withDefaults())
        .authorizeRequests()
        .antMatchers("/").permitAll()
        .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
        .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("admin")
        .antMatchers("/api/**").authenticated()
        .and()
        .exceptionHandling()
        .authenticationEntryPoint(problemSupport)
        .accessDeniedHandler(problemSupport)
        .and()
        .oauth2ResourceServer()
        .jwt();


    // @formatter:on
  }


  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "authorization", "credential", "x-requested-with", "X-XSRF-TOKEN"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
