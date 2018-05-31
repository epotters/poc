package poc.jobs.collectors.impl;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;


/**
 * Created by eelko on 2017-01-05
 */
public class PublicLibraryDataCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(PublicLibraryDataCollectorTest.class);

  private PublicLibraryDataCollector collector;


  @Before
  public void before() {

    LOG.debug("Setup before testing");
    collector = new PublicLibraryDataCollector();
  }


  @Ignore
  @Test
  public void collectData() throws Exception {

    LOG.debug("About to collect data from Bibliotheek");
    collector.collect();
    LOG.debug("Data collected from Bibliotheek");
  }
}
