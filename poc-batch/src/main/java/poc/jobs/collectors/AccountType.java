package poc.jobs.collectors;


import java.util.ResourceBundle;

import lombok.Getter;


/**
 * Created by epotters on 2017-02-13
 */
public enum AccountType {

  ING, IMDB, MY_GOVERNMENT, OV_CHIPCARD, PARK_MOBILE, PUBLIC_LIBRARY;

  private static final String DOT = ".";

  @Getter
  private String displayName;

  @Getter
  private String name;

  @Getter
  private String loginPageUrl;

  private String sitesPropertyPath = "collectors.sites";
  private String sitePropertyPath = "site";

  private static final String NAME_KEY = "name";
  private static final String DISPLAY_NAME_KEY = "displayName";
  private static final String LOGIN_PAGE_URL_KEY = "loginPageUrl";


  AccountType() {

    ResourceBundle sites = ResourceBundle.getBundle(sitesPropertyPath);

    this.name = sites.getString(buildKeyForType(sitePropertyPath) + NAME_KEY);
    this.displayName = sites.getString(buildKeyForType(sitePropertyPath) + DISPLAY_NAME_KEY);
    this.loginPageUrl = sites.getString(buildKeyForType(sitePropertyPath) + LOGIN_PAGE_URL_KEY);
  }


  protected String buildKeyForType(String basePropertyPath) {
    String[] nameParts = name().split("_");
    String typeName = "";
    boolean isFirst = true;
    for (String namePart : nameParts) {
      if (isFirst) {
        typeName = typeName + namePart.toLowerCase();
        isFirst = false;
      }
      else {
        typeName = typeName + namePart.substring(0, 1).toUpperCase() + namePart.substring(1).toLowerCase();
      }
    }
    return basePropertyPath + DOT + typeName + DOT;
  }

}
