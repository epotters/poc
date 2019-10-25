package poc.test.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static java.util.Objects.nonNull;


@Configuration
@Import(IntegrationTestConfiguration.class)
public class TestClientConfig {


  @Bean
  public WebClient oAuth2WebClient(ClientRegistrationRepository clientRegistrations,
      OAuth2AuthorizedClientRepository authorizedClients) {

    ServletOAuth2AuthorizedClientExchangeFilterFunction oauth =
        new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients);

    // (optional) explicitly opt into using the oauth2Login to provide an access token implicitly
    oauth.setDefaultOAuth2AuthorizedClient(true);

    // (optional) set a default ClientRegistration.registrationId
    oauth.setDefaultClientRegistrationId("poc-api");

    return WebClient.builder()
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)
        .filter(errorHandler())
        .apply(oauth.oauth2Configuration())
        .build();
  }


  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

    http.authorizeExchange()
        .anyExchange()
        .authenticated()
        .and()
        .oauth2Login();

//    http.authorizeExchange()
//        .anyExchange()
//        .authenticated()
//        .and()
//        .oauth2Client()
//        .and()
//        .formLogin();

    return http.build();
  }


  public static ExchangeFilterFunction errorHandler() {

    return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {

      if (nonNull(clientResponse.statusCode()) && clientResponse.statusCode().is5xxServerError()) {
        //this is where I want to modify the response
//        resp.setError("This is the error");
      }
      // Not necessarily the correct return type here
      return Mono.just(clientResponse);
    });
  }
}
