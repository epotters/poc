package poc.core.domain;


import java.util.Collection;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.provider.ClientDetails;

import lombok.Data;


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
  private Collection<GrantedAuthority> authorities;
  private Integer accessTokenValiditySeconds = 3600;
  private Integer refreshTokenValiditySeconds = 36000;
  private Map<String, Object> additionalInformation;


  @Override
  public String getClientId() {
    return clientId;
  }


  @Override
  public Set<String> getResourceIds() {
    return resourceIds;
  }


  @Override
  public boolean isSecretRequired() {
    return secretRequired;
  }


  @Override
  public String getClientSecret() {
    return clientSecret;
  }


  @Override
  public boolean isScoped() {
    return false;
  }


  @Override
  public Set<String> getScope() {
    return scopes;
  }


  @Override
  public Set<String> getAuthorizedGrantTypes() {
    return authorizedGrantTypes;
  }


  @Override
  public Set<String> getRegisteredRedirectUri() {
    return registeredRedirectUris;
  }


  @Override
  public Collection<GrantedAuthority> getAuthorities() {
    return authorities;
  }


  @Override
  public Integer getAccessTokenValiditySeconds() {
    return accessTokenValiditySeconds;
  }


  @Override
  public Integer getRefreshTokenValiditySeconds() {
    return refreshTokenValiditySeconds;
  }


  @Override
  public boolean isAutoApprove(String s) {
    return false;
  }


  @Override
  public Map<String, Object> getAdditionalInformation() {
    return additionalInformation;
  }


  public void addAuthority(UserRole authority) {
    if (!authorities.contains(authority)) {
      authorities.add(authority);
    }
  }
}
