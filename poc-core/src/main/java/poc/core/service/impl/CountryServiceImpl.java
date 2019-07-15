package poc.core.service.impl;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;
import poc.core.domain.Country;
import poc.core.service.CountryService;


@Component
public class CountryServiceImpl implements CountryService {

  @Override
  public List<Country> getCountries() {

    List<Country> countries = new ArrayList<>();
    String[] isoCountries = Locale.getISOCountries();

    for (String countryCode : isoCountries) {
      Locale locale = new Locale("", countryCode);
      countries.add(new Country(locale.getCountry(), locale.getDisplayCountry()));
    }

    countries.sort(new Comparator<Country>() {
      @Override
      public int compare(Country countryA, Country countryB) {
        return countryA.getDisplayName().compareTo(countryB.getDisplayName());
      }
    });

    return countries;
  }
}
