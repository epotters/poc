import javax.jcr.Node;
import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;

import org.apache.jackrabbit.core.TransientRepository;


/**
 * Second hop example. Stores, retrieves, and removes example content.
 */
public class SecondHop {

  /**
   * The main entry point of the example application.
   *
   * @param args command line arguments (ignored)
   * @throws Exception if an error occurs
   */
  public static void main(String[] args) throws Exception {

    Data.setRepositoryProperties();
    Repository repository = new TransientRepository();
    Session session = repository.login(new SimpleCredentials(Data.USERNAME, Data.PASSWORD.toCharArray()));

    try {
      Node root = session.getRootNode();

      // Store content
      Node hello = root.addNode("hello");
      Node world = hello.addNode("world");
      world.setProperty("message", "Hello, World!");
      session.save();

      // Retrieve content
      Node node = root.getNode("hello/world");
      System.out.println(node.getPath());
      System.out.println(node.getProperty("message").getString());

      // Remove content
      root.getNode("hello").remove();
      session.save();
    }
    finally {
      session.logout();
    }
  }

/*

  // Source: http://archive.oreilly.com/pub/a/onjava/2006/10/04/what-is-java-content-repository.html?page=4

  public void attachFileToBlogEntry(String blogTitle,
                                    InputStream uploadInputStream) throws BlogApplicationException {
    Session session = JackrabbitPlugin.getSession();
    Node blogEntryNode = getBlogEntryNode(blogTitle, session);
    blogEntryNode.setProperty(PROP_ATTACHMENT, uploadInputStream);
    session.save();

  }
  public InputStream getAttachedFile(String blogTitle) throws BlogApplicationException {
    InputStream attachFileIS = null;
    Node blogEntryNode = getBlogEntryNode(blogTitle);
    Value attachFileValue = (Value) blogEntryNode.getProperty(PROP_ATTACHMENT).getValue();
    attachFileIS = attachFileValue.getStream();
    return attachFileIS;
  }

*/

}
