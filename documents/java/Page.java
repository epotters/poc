package nl.abz.os;


public class Page {
  private String name;
  private String title;
  private Integer pageNumber;
  private boolean inOverview;
  private String icon;
  private String type;
  private String template;


  protected Page(String name, String title, Integer pageNumber, boolean inOverview, String icon, String type, String template) {
    this.name = name;
    this.title = title;
    this.pageNumber = pageNumber;
    this.inOverview = inOverview;
    this.icon = icon;
    this.type = type;
    this.template = template;
  }


  public String getName() {
    return name;
  }


  public String getTitle() {
    return title;
  }


  public Integer getPageNumber() {
    return pageNumber;
  }


  public boolean isInOverview() {
    return inOverview;
  }


  public String getIcon() {
    return icon;
  }


  public String getType() {
    return type;
  }


  public String getTemplate() {
    return template;
  }
}
