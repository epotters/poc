import org.apache.jackrabbit.core.TransientRepository;

import javax.jcr.Repository;
import javax.jcr.Session;

/**
 * Created by eelko on 13-12-2015.
 */


/**
 * First hop example. Logs in to a content repository and prints a
 * status message.
 */

public class FirstHop {

  /**
   * The main entry point of the example application.
   *
   * @param args command line arguments (ignored)
   * @throws Exception if an error occurs
   */
  public static void main(String[] args) throws Exception {

    Data.setRepositoryProperties();

    Repository repository = new TransientRepository();
    Session session = repository.login();
    try {
      String user = session.getUserID();
      String name = repository.getDescriptor(Repository.REP_NAME_DESC);
      System.out.println("Logged in as " + user + " to a " + name + " repository.");
    }
    finally {
      session.logout();
    }
  }
}


