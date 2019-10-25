package poc.web.api.it;


import java.net.URI;
import java.net.URISyntaxException;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.HttpClientErrorException;
import reactor.core.publisher.Mono;


@Profile("integration-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public class GeneralControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void contextLoads() {
    System.out.println("\n\n-----> Context loaded <-----\n\n");
  }


  @Test
  public void healthCheck() throws URISyntaxException {
    health();
  }


  @Test
  public void obtainToken() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;


    final String indent = "   ";
    System.out.println("Access token:");
    System.out.println(indent + "Authorized client registration id: " + oauthToken.getAuthorizedClientRegistrationId());
    System.out.println(indent + "Authorities: " + oauthToken.getPrincipal().getAuthorities());
    System.out.println(indent + "Credentials: " + oauthToken.getCredentials());

    Assert.assertEquals("poc-api", oauthToken.getAuthorizedClientRegistrationId());
  }


  @Test
  public void currentUser() {
    String uri = getRestUri() + "/users/me";

    OidcUser currentUser = this.webClient
        .get()
        .uri(uri)
        .retrieve()
        .bodyToMono(DefaultOidcUser.class).block();

    System.out.println(currentUser);
    Assert.assertEquals("Unexpected current user found", "eelko", currentUser.getName());
  }


  @Test
  public void error404() throws URISyntaxException {
    final URI uri = new URI(getRestUri() + "/this-url-does-not-exist");
    System.out.println("Rest URI for 404 error: " + uri);
    try {
      Mono<String> body = this.webClient
          .get()
          .uri(uri)
          .retrieve()
          .bodyToMono(String.class);
    } catch (HttpClientErrorException httpClientErrorException) {
      Assert.assertEquals("Unexpected error code", HttpStatus.NOT_FOUND, httpClientErrorException.getStatusCode());
    }
  }
}
