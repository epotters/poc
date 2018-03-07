package poc.rest.service;


import java.io.IOException;
import java.util.List;
import java.util.Locale;


public interface LocalizedMessageService {

  String getMessage(String key);

  Locale currentLocale();

  List<Locale> customizedLocales() throws IOException;

  List<Locale> availableLocales();

}
