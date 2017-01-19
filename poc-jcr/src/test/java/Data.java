/**
 * Created by eelko on 13-12-2015.
 */
public class Data {

  public static final String USERNAME = "admin";
  public static final String PASSWORD = "admin";

  public static final String REPOSITORY_PATH =
      "C:\\Users\\epotters.SOLERANL\\Dropbox\\Projects\\poc\\poc-jcr\\target\\jackrabbit\\repository\\";
  // "/Users/eelko/Work/Projects/poc/poc-jcr/target/jackrabbit/repository/";


  public static void setRepositoryProperties() {
    System.setProperty("org.apache.jackrabbit.repository.home", REPOSITORY_PATH);
    System.setProperty("org.apache.jackrabbit.repository.conf", REPOSITORY_PATH + "repository.xml");
  }

}
