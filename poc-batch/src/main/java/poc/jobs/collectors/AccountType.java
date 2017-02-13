package poc.jobs.collectors;


import java.util.ResourceBundle;

import lombok.Getter;


/**
 * Created by epotters on 13-2-2017.
 */
public enum AccountType {

  ING, IMDB, OV_CHIPCARD, PARK_MOBILE, PUBLIC_LIBRARY;

  private static final String DOT = ".";

  @Getter
  private String displayName;

  @Getter
  private String name;

  @Getter
  private String loginPageUrl;

  private String sitesPropertyPath = "collectors.sites";
  private String sitePropertyPath = "site";


  private AccountType() {

    ResourceBundle sites = ResourceBundle.getBundle(sitesPropertyPath);

    this.displayName = sites.getString(buildKeyForType(sitePropertyPath) + "displayName");
    this.name = sites.getString(buildKeyForType(sitePropertyPath) + "name");
    this.loginPageUrl = sites.getString(buildKeyForType(sitePropertyPath) + "loginPageUrl");
  }



  protected String buildKeyForType(String basePropertyPath) {
    String[] nameParts = name().split("_");
    String typeName = "";
    boolean isFirst = true;
    for (String namePart : nameParts) {

      if (isFirst) {
        typeName = typeName + namePart.toLowerCase();
        isFirst = false;
      } else {
        typeName = typeName + namePart.substring(0, 1).toUpperCase() + namePart.substring(1).toLowerCase();
      }
    }
    return basePropertyPath + DOT + typeName + DOT;
  }

}
