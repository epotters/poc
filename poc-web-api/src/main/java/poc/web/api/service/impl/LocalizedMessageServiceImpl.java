package poc.web.api.service.impl;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import poc.web.api.service.LocalizedMessageService;


@Component
public class LocalizedMessageServiceImpl implements LocalizedMessageService {

  @Autowired
  private ResourcePatternResolver resourceResolver;

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


  public List<Locale> customizedLocales() throws IOException {
    List<Locale> locales = new ArrayList<>();

    String resourcePattern = "classpath:locale/*.properties";
    String startString = "messages_";
    String endString = ".properties";

    Resource[] resources = resourceResolver.getResources(resourcePattern);
    for (Resource resource : resources) {
      String fileName = resource.getFilename();
      if (fileName.startsWith(startString) && fileName.endsWith(endString)) {
        String languageTag = fileName.substring(startString.length(), fileName.indexOf(endString));
        locales.add(Locale.forLanguageTag(languageTag));
      }
    }
    return locales;
  }


  public List<String> listKeys() {
    List<String> keys = new ArrayList<>();
    ResourceBundle messages = ResourceBundle.getBundle("locale/messages", currentLocale());
    keys.addAll(messages.keySet());
    return keys;
  }


  @Override
  public List<Locale> availableLocales() {
    return Arrays.asList(Locale.getAvailableLocales());
  }

}
