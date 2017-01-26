package poc.jobs.collectors;


import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;


/**
 * Created by eelko on 2017-01-05
 */

@RunWith(SpringRunner.class)
public class IngDataCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(IngDataCollectorTest.class);

  private IngDataCollector collector;


  @Before
  public void before() {
    LOG.debug("Setup");
    collector = new IngDataCollector();
  }


  @Test
  public void collectData() throws Exception {
    LOG.debug("About to collect data from ING");
    collector.collect();
  }
}
