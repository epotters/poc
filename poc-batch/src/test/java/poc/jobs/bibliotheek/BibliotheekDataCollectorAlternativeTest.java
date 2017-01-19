package poc.jobs.bibliotheek;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;


/**
 * Created by eelko on 2017-01-05
 */
public class BibliotheekDataCollectorAlternativeTest {

  private static final Log LOG = LogFactory.getLog(BibliotheekDataCollectorAlternativeTest.class);

  private BibliotheekDataCollectorAlternative collector;


  @Before
  public void before() {

    LOG.debug("Setup before testing");
    collector = new BibliotheekDataCollectorAlternative();
  }


  @Test
  public void collectData() throws Exception {

    LOG.debug("About to collect data from Bibliotheek");
    collector.collect();
    LOG.debug("Data collected from Bibliotheek");
  }
}
