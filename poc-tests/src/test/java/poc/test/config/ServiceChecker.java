package poc.test.config;


import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class ServiceChecker {


  private final int defaultPingTimeout = 10;


  public void checkAndStartLocal() throws IOException {

    final List<RequiredService> localServices = Arrays.asList(

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


  public void checkRemote() {
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
