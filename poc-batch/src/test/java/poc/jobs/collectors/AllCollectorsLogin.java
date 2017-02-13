package poc.jobs.collectors;


import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;


/**
 * Created by epotters on 8-2-2017.
 */
public class AllCollectorsLogin {

  private static final Log LOG = LogFactory.getLog(AllCollectorsLogin.class);


  @Test
  public void loginAll() {

    List<DataCollector> collectors = new ArrayList<>();

    collectors.add(new IngDataCollector());
    collectors.add(new ImdbDataCollector());
    collectors.add(new PublicLibraryDataCollector());
    collectors.add(new OvChipkaartDataCollector());
    collectors.add(new ParkMobileDataCollector());

    for (DataCollector collector : collectors) {

      try {
        collector.login();
      } catch(Exception exception) {
        LOG.error("Unable to login to " + collector.toString());
      }
    }
  }
}
