package poc.web.api;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class Application {

  private static final Log LOG = LogFactory.getLog(Application.class);


  public static void main(String[] args) {
    LOG.info("Starting Proof of Concept application");
    SpringApplication.run(Application.class, args);
  }
}