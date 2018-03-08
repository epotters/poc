package bowlon.test.service.impl;


import java.util.List;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.junit4.SpringRunner;

import bowlon.core.service.AnnaliesjesImportService;


@RunWith(SpringRunner.class)
public class GoogleSpreadsheetAnnaliesjesImportServiceTest extends AnnaliesjesImportServiceBaseTest {

  @Autowired
  @Qualifier("googleSpreadsheetAnnaliesjesImportService")
  private AnnaliesjesImportService annaliesjesImportService;


  public GoogleSpreadsheetAnnaliesjesImportServiceTest() throws InstantiationException, IllegalAccessException {
    if (annaliesjesImportService == null) {
      LOG.debug("Importservice is null");
    } else {
      LOG.debug("Importservice is NOT null");
    }
  }


  @Before
  public void before() {
    LOG.debug("Running @Before");
    if (annaliesjesImportService == null) {
      LOG.debug("ImportService is NULL");
    }
    clearAllRepositories();
  }


  @Test
  public void listFiles() throws Exception {
    List<String> files = annaliesjesImportService.availableAnnaliesjes();
    listAvailableAnnaliesjes(files);
    Assert.assertEquals(5, files.size());
  }


  // @Test
  public void importScoresForOneNight() throws Exception {
    importScores(LEAGUE_NIGHT, 1, 10, 40);

    Assert.assertEquals("Number of bowl nights imported is incorrect", EXPECTED_LEAGUE_NIGHTS,
        leagueNightRepository.findAll().size());
    Assert.assertEquals("Number of games imported is incorrect", EXPECTED_GAMES, gameRepository.findAll().size());
    Assert.assertEquals("Number of player games (scores) imported is incorrect", EXPECTED_PLAYER_GAMES,
        playerGameRepository.findAll().size());
  }


  @Test
  public void importAllScores() throws Exception {
    importScores(null, EXPECTED_LEAGUE_NIGHTS, EXPECTED_GAMES, EXPECTED_PLAYER_GAMES);
  }


  @After
  public void after() {
    LOG.debug("Running @After");
  }


  protected void importScores(Integer leagueNight, int expectedNights, int expectedGames, int expectedPlayerGames)
      throws Exception {
    String fileName = "109_bowlon_20151010.xlsx";
    annaliesjesImportService.processAnnaliesje(fileName, leagueNight);
  }

}
