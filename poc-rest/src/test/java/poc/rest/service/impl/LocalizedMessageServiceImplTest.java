package poc.rest.service.impl;


import junit.framework.Assert;
import poc.rest.service.LocalizedMessageService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.Set;


/**
 * Created by epotters on 2016-02-01
 */

@ContextConfiguration(classes = { poc.rest.config.RestContext.class })
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class, TransactionalTestExecutionListener.class })
@RunWith(SpringJUnit4ClassRunner.class)
public class LocalizedMessageServiceImplTest {

  @Autowired
  LocalizedMessageService messageService;


  @Before
  public void init() throws IOException {
    listLocales(messageService.customizedLocales(), "Customized locales");
    listLocales(messageService.availableLocales(), "All available locales");
  }


  @Test
  public void printMessages() {

    String message = messageService.getMessage("person.lastName.label");
    System.out.println(message);
    Assert.assertEquals("Last name", message);

    Locale locale = new Locale("es");
    LocaleContextHolder.setLocale(locale);
    message = messageService.getMessage("person.lastName.label");
    System.out.println(message);
    Assert.assertEquals("Nombre", message);

    Assert.assertEquals(locale, messageService.currentLocale());
  }




  private void listLocales(List<Locale> locales, String title) {

    System.out.println(title);
    for (Locale locale : locales) {
      System.out.println(locale.getDisplayName());
    }

    System.out.println("\n\n");
  }


}
