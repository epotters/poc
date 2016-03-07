package poc.core.domain;


public class Greeting {

  private final long id;
  private final String content;


  public Greeting(long id, String content) {
    this.id = id;
    this.content = content;
  }


  public void greet(Person person) {

  }


  public long getId() {
    return id;
  }


  public String getContent() {
    return content;
  }
}
