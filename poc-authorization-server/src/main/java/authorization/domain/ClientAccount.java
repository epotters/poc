package authorization.domain;


import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.provider.ClientDetails;


@Data
public class ClientAccount implements ClientDetails {

  private String clientId;
  private String displayName;

  private Set<String> resourceIds;
  private boolean secretRequired = true;
  private String clientSecret;
  private boolean scoped = true;
  private Set<String> scopes;
  private Set<String> authorizedGrantTypes;
  private Set<String> registeredRedirectUris;
  private Collection<GrantedAuthority> authorities = new HashSet<>();
  private boolean autoApprove = false;

  private Integer accessTokenValiditySeconds = 3600;
  private Integer refreshTokenValiditySeconds = 36000;
  private Map<String, Object> additionalInformation;


  @Override
  public Set<String> getScope() {
    return scopes;
  }

  @Override
  public Set<String> getRegisteredRedirectUri() {
    return registeredRedirectUris;
  }

  @Override
  public boolean isAutoApprove(String s) {
    return autoApprove;
  }

  public void addAuthority(UserRole authority) {
    if (!authorities.contains(authority)) {
      authorities.add(authority);
    }
  }
}
