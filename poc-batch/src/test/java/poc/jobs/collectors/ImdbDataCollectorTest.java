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
public class ImdbDataCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(ImdbDataCollectorTest.class);

  private ImdbDataCollector collector;


  @Before
  public void before() {
    LOG.debug("Setup");
    collector = new ImdbDataCollector();
  }


  @Test
  public void collectData() throws Exception {
    LOG.debug("About to collect data from IMDB");
    collector.login();
    // collector.collect();
  }
}
