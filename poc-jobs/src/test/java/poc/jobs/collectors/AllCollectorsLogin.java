package poc.jobs.collectors;


import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import poc.jobs.collectors.impl.ImdbDataCollector;
import poc.jobs.collectors.impl.IngDataCollector;
import poc.jobs.collectors.impl.MyGovernmentDataCollector;
import poc.jobs.collectors.impl.OvChipkaartDataCollector;
import poc.jobs.collectors.impl.ParkMobileDataCollector;
import poc.jobs.collectors.impl.PublicLibraryDataCollector;

@RunWith(SpringRunner.class)
public class AllCollectorsLogin {

  private static final Log LOG = LogFactory.getLog(AllCollectorsLogin.class);

  @Ignore
  @Test
  public void loginAll() throws Exception {

    List<DataCollector> collectors = new ArrayList<>();

    collectors.add(new ImdbDataCollector());
    collectors.add(new IngDataCollector());
    collectors.add(new MyGovernmentDataCollector());
    collectors.add(new OvChipkaartDataCollector());
    collectors.add(new ParkMobileDataCollector());
    collectors.add(new PublicLibraryDataCollector());

    for (DataCollector collector : collectors) {
      logInAndOut(collector);
    }
  }


  private void logInAndOut(DataCollector collector) throws Exception {
    String collectorDisplayName = collector.getType().getDisplayName();

    LOG.info("Logging in " + collectorDisplayName);
    collector.login();

    Assert.isTrue(collector.isLoggedIn(), "User should be logged in, but is not");
    LOG.info("Logged in " + collectorDisplayName);

    LOG.info("Logging out " + collectorDisplayName);
    collector.logout();

    Assert.isTrue(collector.isLoggedIn(), "User should not be logged in anymore, but still is");
    LOG.info("Logged out " + collectorDisplayName);
  }
}
