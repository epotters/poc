package poc.web.api.service.impl;


import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import poc.web.api.config.RestContext;
import poc.web.api.service.LocalizedMessageService;


@ActiveProfiles("test")
@SpringBootTest(classes = {RestContext.class})
//@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@RunWith(SpringRunner.class)
public class LocalizedMessageServiceImplTest {

  @Autowired
  private LocalizedMessageService messageService;


  public LocalizedMessageServiceImplTest() {
  }


  @Before
  public void init() throws IOException {
    listLocales(messageService.customizedLocales(), "Customized locales");
    // listLocales(messageService.availableLocales(), "All available locales");
  }


  @Test
  public void printMessages() {

    System.out.println("Current locale's language: " + messageService.currentLocale().getDisplayLanguage());
    String message = messageService.getMessage("person.lastName.label");
    System.out.println(message);
    Assert.assertEquals("Last name", message);

    Locale locale = new Locale("nl");
    LocaleContextHolder.setLocale(locale);
    message = messageService.getMessage("person.lastName.label");
    System.out.println(message);
    Assert.assertEquals("Achternaam", message);

    locale = new Locale("es");
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
