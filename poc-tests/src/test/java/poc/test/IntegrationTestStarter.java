package poc.test;


import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ConfigurableApplicationContext;
import poc.test.config.ServiceChecker;


@Slf4j
//@ActiveProfiles({"test", "integration-test"})
//@SpringBootApplication
public class IntegrationTestStarter implements CommandLineRunner {


  public static void main(String[] args) throws Exception {
    SpringApplication app = new SpringApplication(IntegrationTestStarter.class);
    app.setWebApplicationType(WebApplicationType.NONE);
    ConfigurableApplicationContext ctx = app.run(args);
  }


  @Override
  public void run(String... args) throws Exception {

    log.info("Running integration tests");

    // TODO: Start the integration tests here
    final ServiceChecker serviceChecker = new ServiceChecker();

    if (isLocal()) {
      serviceChecker.checkAndStartLocal();
    } else {
      serviceChecker.checkRemote();
    }
  }


  private boolean isLocal() {
    // TODO: Implement actual local check
    return true;
  }
}
