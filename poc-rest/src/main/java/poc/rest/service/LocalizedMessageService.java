package poc.rest.service;


import java.io.IOException;
import java.util.List;
import java.util.Locale;


/**
 * Created by epotters on 2016-02-01
 */

public interface LocalizedMessageService {

  public String getMessage(String key);

  public Locale currentLocale();

  public List<Locale> customizedLocales() throws IOException;

  public List<Locale> availableLocales();

}
