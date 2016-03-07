package poc.rest.service.impl;


import poc.rest.service.LocalizedMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;


/**
 * Created by epotters on 2016-02-01
 */

@Component
public class LocalizedMessageServiceImpl implements LocalizedMessageService {

  @Autowired
  private MessageSource messageSource;


  @Override
  public String getMessage(String key) {
    Locale locale = LocaleContextHolder.getLocale();
    return messageSource.getMessage(key, null, locale);
  }


  @Override
  public Locale currentLocale() {
    return LocaleContextHolder.getLocale();
  }


  @Override
  public List<Locale> availableLocales() {
    List<Locale> locales = new ArrayList<>();
    Locale[] allAvailableLocales = Locale.getAvailableLocales();

    for (Locale locale : allAvailableLocales) {
      try {
        String msg = messageSource.getMessage("person.firstName.label", null, locale);
        System.out.println(msg + " - " + locale.getDisplayName());

        locales.add(locale);
      }
      catch (NoSuchMessageException nsme) {
        System.out.println("No resource bundle found for " + locale.getDisplayName());
      }
    }
    return locales;
  }

}
