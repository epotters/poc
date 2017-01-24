package poc.jobs.collectors;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;


/**
 * Created by eelko on 2017-01-05
 */
public class BibliotheekDataCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(BibliotheekDataCollectorTest.class);

  private BibliotheekDataCollector collector;


  @Before
  public void before() {

    LOG.debug("Setup before testing");
    collector = new BibliotheekDataCollector();
  }


  @Test
  public void collectData() throws Exception {

    LOG.debug("About to collect data from Bibliotheek");
    collector.collect();
    LOG.debug("Data collected from Bibliotheek");
  }
}
