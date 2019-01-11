package poc.jobs.collectors;


import java.util.ResourceBundle;

import lombok.Getter;


public enum AccountType {

  ING, IMDB, MY_GOVERNMENT, OV_CHIPCARD, PARK_MOBILE, PUBLIC_LIBRARY;

  private static final String DOT = ".";
  private static final String NAME_KEY = "name";
  private static final String DISPLAY_NAME_KEY = "displayName";
  private static final String LOGIN_PAGE_URL_KEY = "loginPageUrl";
  @Getter
  private String displayName;
  @Getter
  private String name;
  @Getter
  private String loginPageUrl;
  private String sitesPropertyPath = "collectors.sites";
  private String sitePropertyPath = "site";


  AccountType() {

    ResourceBundle sites = ResourceBundle.getBundle(sitesPropertyPath);

    this.name = sites.getString(buildKeyForType(sitePropertyPath) + NAME_KEY);
    this.displayName = sites.getString(buildKeyForType(sitePropertyPath) + DISPLAY_NAME_KEY);
    this.loginPageUrl = sites.getString(buildKeyForType(sitePropertyPath) + LOGIN_PAGE_URL_KEY);
  }


  protected String buildKeyForType(String basePropertyPath) {
    String[] nameParts = name().split("_");
    boolean isFirst = true;
    StringBuilder typeNameBuilder = new StringBuilder();
    for (String namePart : nameParts) {
      if (isFirst) {
        typeNameBuilder.append(namePart.toLowerCase());
        isFirst = false;
      } else {
        typeNameBuilder.append(namePart.substring(0, 1).toUpperCase()).append(namePart.substring(1).toLowerCase());
      }
    }
    return basePropertyPath + DOT + typeNameBuilder.toString() + DOT;
  }

}
