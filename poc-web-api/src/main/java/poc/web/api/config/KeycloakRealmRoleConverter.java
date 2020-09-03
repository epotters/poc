package poc.web.api.config;


import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

// Source: https://blog.jdriven.com/2019/10/spring-security-5-2-oauth-2-exploration-part1/
public class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

  static final String ROLES_BASE_KEY = "realm_access";
  static final String ROLES_KEY = "roles";
  static final String ROLE_PREFIX = "ROLE_";


  public Collection<GrantedAuthority> convert(final Jwt jwt) {
    final Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get(ROLES_BASE_KEY);
    return (
        (List<String>) realmAccess.get(ROLES_KEY)).stream()
        .map(roleName -> ROLE_PREFIX + roleName)
        .map(SimpleGrantedAuthority::new)
        .collect(Collectors.toList());
  }


  static String kebabToSnakeCase(final String kebabString) {
    return kebabString.replace("-", "_").toUpperCase();
  }
}
