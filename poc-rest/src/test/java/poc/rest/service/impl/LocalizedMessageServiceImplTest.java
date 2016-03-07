package poc.rest.service.impl;


import junit.framework.Assert;
import poc.rest.service.LocalizedMessageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import java.util.List;
import java.util.Locale;


/**
 * Created by epotters on 2016-02-01
 */

@ContextConfiguration(classes = { poc.rest.config.RestContext.class })
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class, TransactionalTestExecutionListener.class })
@RunWith(SpringJUnit4ClassRunner.class)
public class LocalizedMessageServiceImplTest {

  @Autowired
  LocalizedMessageService messageService;


  @Test
  public void printMessages() {

    String message = messageService.getMessage("person.lastName.label");
    System.out.println(message);

    Locale locale = new Locale("es");
    LocaleContextHolder.setLocale(locale);
    message = messageService.getMessage("person.lastName.label");
    System.out.println(message);
  }


  @Test
  public void listAvailableLocales() {

    List<Locale> locales = messageService.availableLocales();

    for (Locale locale : locales) {
      System.out.println(locale.getDisplayName());
    }

    Assert.assertEquals(3, locales.size());
  }

}
