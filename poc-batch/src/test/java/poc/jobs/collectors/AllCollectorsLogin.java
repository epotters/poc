package poc.jobs.collectors;


import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;


/**
 * Created by epotters on 2017-02-08
 */
public class AllCollectorsLogin {

  private static final Log LOG = LogFactory.getLog(AllCollectorsLogin.class);


  @Test
  public void loginAll() throws Exception {

    List<DataCollector> collectors = new ArrayList<>();

    collectors.add(new ImdbDataCollector());
    // collectors.add(new IngDataCollector());
    // collectors.add(new MyGovernmentDataCollector());
    // collectors.add(new OvChipkaartDataCollector());
    // collectors.add(new ParkMobileDataCollector());
    // collectors.add(new PublicLibraryDataCollector());


    for (DataCollector collector : collectors) {

      logInAndOut(collector);
    }
  }



  private void logInAndOut(DataCollector collector) throws Exception {
    String collectorDisplayName = collector.getType().getDisplayName();

    LOG.info("Logging in " + collectorDisplayName);
    collector.login();

    collector.isLoggedIn();
    LOG.info("Logged in " + collectorDisplayName);

    LOG.info("Logging out " + collectorDisplayName);
    collector.logout();

    collector.isLoggedIn();
    LOG.info("Logged out " + collectorDisplayName);

  }
}
