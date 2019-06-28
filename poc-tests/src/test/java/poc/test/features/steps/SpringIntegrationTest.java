package poc.test.features.steps;


import java.io.IOException;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import poc.test.config.RemoteApplicationProperties;


@RunWith(SpringRunner.class)
@WebAppConfiguration
@AutoConfigureWebTestClient
public class SpringIntegrationTest {


  protected WebTestClient webTestClient = prepareWebTestClient();

  protected static WebTestClient.ResponseSpec latestResponse = null;


  @Autowired
  protected RemoteApplicationProperties properties;

  protected final String baseUrl = "http://localhost:8002/poc";


  protected void executeGet(String uri) throws IOException {

    latestResponse = this.webTestClient
        .get()
        .uri(uri).accept(MediaType.APPLICATION_JSON)
        .exchange();


//        .retrieve()
//        .bodyToMono(String.class).block();


//        .expectStatus().isOk()
//        .expectHeader().contentType(MediaType.APPLICATION_JSON);
//        .expectBody(String.class)
//        .expectBody(String.class).isEqualTo("201 Created");

  }


  protected void executePost(String uri) throws IOException {

    latestResponse = this.webTestClient
        .post()
        .uri(uri).accept(MediaType.APPLICATION_JSON)
        .exchange();


//        .expectStatus().isOk()
//        .expectHeader().contentType(MediaType.APPLICATION_JSON);
//        .expectBody(String.class);
//        .bodyToMono(String.class).block();
  }


  private WebTestClient prepareWebTestClient() {

    return WebTestClient.bindToServer().build();
  }

}
