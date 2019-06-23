package poc.test.features;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;


@Configuration
public class FeatureTestConfig {


  @Bean
  public OAuth2RestTemplate pocOauth2RestTemplate(OAuth2ProtectedResourceDetails details) {
    OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(details);

    //Prepare by getting access token once
    oAuth2RestTemplate.getAccessToken();
    return oAuth2RestTemplate;
  }


//    String userInfoEndpointUri = client.getClientRegistration()
////        .getProviderDetails().getUserInfoEndpoint().getUri();
////
////    if (!StringUtils.isEmpty(userInfoEndpointUri)) {
////      RestTemplate restTemplate = new RestTemplate();
////      HttpHeaders headers = new HttpHeaders();
////      headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + client.getAccessToken()
////          .getTokenValue());
////      HttpEntity entity = new HttpEntity("", headers);
////      ResponseEntity <map>response = restTemplate
////          .exchange(userInfoEndpointUri, HttpMethod.GET, entity, Map.class);
////      Map userAttributes = response.getBody();
////      model.addAttribute("name", userAttributes.get("name"));
////    }

//  private HttpHeaders buildHeaders() {
//
//
//  }


}
