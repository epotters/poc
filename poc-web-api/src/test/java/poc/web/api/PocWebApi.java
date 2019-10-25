package poc.web.api;


import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class PocWebApi {

  public static void main(String[] args) throws Exception {
    log.info("Starting Proof of Concept application TEST");
    SpringApplication.run(PocWebApi.class, args);
  }
}
