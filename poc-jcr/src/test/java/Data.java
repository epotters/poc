/**
 * Created by eelko on 13-12-2015.
 */
public class Data {

  public static final String USERNAME = "admin";
  public static final String PASSWORD = "admin";


  public static void setRepositoryProperties() {
    System.setProperty("org.apache.jackrabbit.repository.home",
        "/Users/eelko/Work/Projects/poc/poc-jcr/target/jackrabbit/repository");
    System.setProperty("org.apache.jackrabbit.repository.conf",
        "/Users/eelko/Work/Projects/poc/poc-jcr/target/jackrabbit/repository.xml");
  }

}
