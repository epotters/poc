package poc.rest.service;

import java.util.List;
import java.util.Locale;

/**
 * Created by epotters on 2016-02-01
 */


public interface LocalizedMessageService {

  public String getMessage(String key);

  public List<Locale> availableLocales();

  public Locale currentLocale();

}
