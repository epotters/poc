package poc.web.api.config;


import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import poc.core.config.CoreContext;


@Configuration
@Import(CoreContext.class)
@ComponentScan(basePackages = {"poc.web.api.service", "poc.web.api.controller"})
public class RestContext implements WebMvcConfigurer {

  @Bean
  public LocaleResolver localeResolver() {
    SessionLocaleResolver slr = new SessionLocaleResolver();
    slr.setDefaultLocale(Locale.US);
    return slr;
  }


  @Bean
  public ReloadableResourceBundleMessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
    messageSource.setBasename("classpath:locale/messages");
    messageSource.setCacheSeconds(3600); // Refresh cache once per hour
    return messageSource;
  }


  @Bean
  public ErrorAttributes errorAttributes() {
    return new DefaultErrorAttributes();
  }

  /*
  Source: https://stackoverflow.com/questions/33727017/configure-jackson-to-omit-lazy-loading-attributes-in-spring-boot
  */
  @Override
  public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    for (HttpMessageConverter converter : converters) {
      if (converter instanceof org.springframework.http.converter.json.MappingJackson2HttpMessageConverter) {
        ObjectMapper mapper = ((MappingJackson2HttpMessageConverter) converter).getObjectMapper();
        mapper.registerModule(new Hibernate5Module());
      }
    }
  }


  private static final String dateFormat = "yyyy-MM-dd";
  private static final String dateTimeFormat = "yyyy-MM-dd HH:mm:ss";

  @Bean
  public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder -> {
      builder.simpleDateFormat(dateTimeFormat);
      builder.serializers(new LocalDateSerializer(DateTimeFormatter.ofPattern(dateFormat)));
      builder.serializers(new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(dateTimeFormat)));
    };
  }

}
