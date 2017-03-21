package poc.jobs.collectors;


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
public class OvChipkaartCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(OvChipkaartCollectorTest.class);

  private OvChipkaartDataCollector collector;


  @Before
  public void before() {
    LOG.debug("Setup");
    collector = new OvChipkaartDataCollector();
  }


  @Test
  public void collectData() throws Exception {

    LOG.debug("About to collect data from OV Chipkaart");
    collector.collect();
  }
}
