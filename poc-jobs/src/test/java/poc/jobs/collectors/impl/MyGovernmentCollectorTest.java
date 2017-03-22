package poc.jobs.collectors.impl;


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
public class MyGovernmentCollectorTest extends BaseDataCollectorTest {

  private static final Log LOG = LogFactory.getLog(MyGovernmentCollectorTest.class);

  private MyGovernmentDataCollector collector;


  @Before
  public void before() {
    LOG.debug("Setup");
    collector = new MyGovernmentDataCollector();
  }


  @Test
  public void collectData() throws Exception {

    LOG.debug("About to collect data from collector");
    collector.collect();
  }
}
