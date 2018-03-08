package bowlon.test.service.impl;


import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.runners.Parameterized.Parameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.rules.SpringClassRule;
import org.springframework.test.context.junit4.rules.SpringMethodRule;

import bowlon.core.domain.Game;
import bowlon.core.domain.LeagueNight;
import bowlon.core.domain.PlayerGame;
import bowlon.core.repository.GameRepository;
import bowlon.core.repository.LeagueNightRepository;
import bowlon.core.repository.PlayerGameRepository;
import bowlon.core.repository.PlayerRepository;
import bowlon.core.service.AnnaliesjesImportService;
import bowlon.core.service.impl.CsvAnnaliesjesImportServiceImpl;
import bowlon.core.service.impl.GoogleSheetsAnnaliesjesImportServiceImpl;


//@RunWith(Parameterized.class)
public class AnnaliesjesImportServiceTest {

  @ClassRule
  public static final SpringClassRule SPRING_CLASS_RULE = new SpringClassRule();
  private static final Logger LOG = LoggerFactory.getLogger(AnnaliesjesImportServiceTest.class);
  private static final int LEAGUE_NIGHT = 109;
  private static final int EXPECTED_LEAGUE_NIGHTS = 109;
  private static final int EXPECTED_GAMES = 783;
  private static final int EXPECTED_PLAYER_GAMES = 3506;
  @Rule
  public final SpringMethodRule springMethodRule = new SpringMethodRule();
  @Autowired
  private LeagueNightRepository leagueNightRepository;
  @Autowired
  private PlayerRepository playerRepository;
  @Autowired
  private GameRepository gameRepository;
  @Autowired
  private PlayerGameRepository playerGameRepository;

  private AnnaliesjesImportService annaliesjesImportService;


  public AnnaliesjesImportServiceTest(Class<AnnaliesjesImportService> implementationClass)
      throws InstantiationException, IllegalAccessException {

    LOG.debug("Running test with implementation class \"" + implementationClass.getSimpleName() + "\"");
    annaliesjesImportService = implementationClass.newInstance();

    if (annaliesjesImportService == null) {
      LOG.debug("Importservice is null");
    } else {

      LOG.debug("Importservice is NOT null");
    }
  }


  @Parameters
  public static Collection<Class> data() {
    return Arrays.asList(new Class[] {CsvAnnaliesjesImportServiceImpl.class, GoogleSheetsAnnaliesjesImportServiceImpl.class,
        GoogleSpreadsheetAnnaliesjesImportServiceImpl.class});
  }


  public void before() {

    LOG.debug("Running @Before");

    if (annaliesjesImportService == null) {
      LOG.debug("ImportService is NULL");
    }

    playerGameRepository.deleteAll();
    gameRepository.deleteAll();
    playerRepository.deleteAll();
    leagueNightRepository.deleteAll();
  }


  public void listFiles() throws Exception {

    List<String> files = annaliesjesImportService.availableAnnaliesjes();

    listAvailableAnnaliesjes(files);

    Assert.assertEquals(1, 1);
  }


  public void importScoresForOneNight() throws Exception {
    importScores(LEAGUE_NIGHT, 1, 10, 40);

    Assert.assertEquals("Number of bowl nights imported is incorrect", EXPECTED_LEAGUE_NIGHTS,
        leagueNightRepository.findAll().size());
    Assert.assertEquals("Number of games imported is incorrect", EXPECTED_GAMES, gameRepository.findAll().size());
    Assert.assertEquals("Number of player games (scores) imported is incorrect", EXPECTED_PLAYER_GAMES,
        playerGameRepository.findAll().size());
  }


  // @Test
  public void importAllScores() throws Exception {
    importScores(null, EXPECTED_LEAGUE_NIGHTS, EXPECTED_GAMES, EXPECTED_PLAYER_GAMES);
  }


  private void importScores(Integer leagueNight, int expectedNights, int expectedGames, int expectedPlayerGames)
      throws Exception {
    String fileName = "bowlon-109.txt";
    annaliesjesImportService.processAnnaliesje(fileName, leagueNight);
  }


  private void listRepositories() {
    List<LeagueNight> leagueNights = leagueNightRepository.findAll();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    for (LeagueNight leagueNight : leagueNights) {
      System.out.println("\nNight " + leagueNight.getSerial() + " - " + formatter.format(leagueNight.getStartTime()));
      List<Game> games = gameRepository.findByLeagueNight(leagueNight);
      for (Game game : games) {
        System.out.println("  Game " + game.getSerial());
        List<PlayerGame> playerGames = playerGameRepository.findByGame(game);
        System.out.println("    - found" + playerGames.size() + " player games");
        for (PlayerGame playerGame : playerGames) {
          System.out.println("    - " + playerGame.getPlayer().getName() + ": " + playerGame.getScore());
        }
      }
    }
  }


  private void listAvailableAnnaliesjes(List<String> fileNames) {
    LOG.debug("Listing available Export FileNames:");
    for (String fileName : fileNames) {
      LOG.debug(fileName);
    }
  }

}
