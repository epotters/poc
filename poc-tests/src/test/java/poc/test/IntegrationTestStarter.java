package poc.test;


import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;


@Slf4j
@ActiveProfiles({"test", "integration-test"})
@SpringBootApplication
public class IntegrationTestStarter implements CommandLineRunner {

  private int defaultPingTimeout = 10;

  public static void main(String[] args) throws Exception {
    SpringApplication app = new SpringApplication(IntegrationTestStarter.class);
    app.setWebApplicationType(WebApplicationType.NONE);
    ConfigurableApplicationContext ctx = app.run(args);
  }


  @Override
  public void run(String... args) throws Exception {

    log.info("Running integration tests");

    // TODO: Start the integration tests here
    if (isLocal()) {
      checkAndStartLocal();
    } else {
      checkRemote();
    }

  }


  private boolean isLocal() {
    // TODO: Implement actual local check
    return true;
  }


  private void checkAndStartLocal() throws IOException {

    List<RequiredService> localServices = Arrays.asList(

        new RequiredService(
            "keycloak.localhost",
            80
        ),

        new RequiredService(
            "localhost",
            8002,
            "poc-web-api/",
            "mvn spring-boot:run"
        ),

        new RequiredService(
            "localhost",
            4200,
            "poc-web-gui-angular/poc-angular",
            "ng serve"
        )
    );


    for (RequiredService localService : localServices) {
      if (localService.isRunning(defaultPingTimeout)) {
        log.info("Service " + localService.getHost() + " is available on port " + localService.getPort());
      } else {
        log.info("Service " + localService.getHost() + " is not available on port " + localService.getPort());
        log.info("Starting service ");
        localService.start();
      }
    }
  }


  private void checkRemote() {
    log.warn("TODO: Remote checking is not implemented yet");
  }


  @Data
  @AllArgsConstructor
  private class RequiredService {

    private String host;
    private int port;
    private String workingDirectory;
    private String startCmd;

    RequiredService(String host, int port) {
      this.host = host;
      this.port = port;
    }

    boolean isStartable() {
      return this.startCmd != null;
    }

    boolean isRunning(int timeout) {
      try (Socket socket = new Socket()) {
        socket.connect(new InetSocketAddress(host, port), timeout);
        return true;
      } catch (IOException e) {
        return false; // Either timeout or unreachable or failed DNS lookup
      }
    }

    void start() throws IOException {
      if (isStartable()) {
        Process process = Runtime.getRuntime().exec(startCmd,
            null, new File(workingDirectory));
      }
    }

  }

}
