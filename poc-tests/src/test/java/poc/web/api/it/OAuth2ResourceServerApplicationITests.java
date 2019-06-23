package poc.web.api.it;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OAuth2ResourceServerApplicationITests {

  private String noScopesToken = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0IiwiZXhwIjo0NjgzODA1MTI4fQ.ULEPdHG-MK5GlrTQMhgqcyug2brTIZaJIrahUeq9zaiwUSdW83fJ7W1IDd2Z3n4a25JY2uhEcoV95lMfccHR6y_2DLrNvfta22SumY9PEDF2pido54LXG6edIGgarnUbJdR4rpRe_5oRGVa8gDx8FnuZsNv6StSZHAzw5OsuevSTJ1UbJm4UfX3wiahFOQ2OI6G-r5TB2rQNdiPHuNyzG5yznUqRIZ7-GCoMqHMaC-1epKxiX8gYXRROuUYTtcMNa86wh7OVDmvwVmFioRcR58UWBRoO1XQexTtOQq_t8KYsrPZhb9gkyW8x2bAQF-d0J0EJY8JslaH6n4RBaZISww";
  private String messageReadToken = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0Iiwic2NvcGUiOiJtZXNzYWdlOnJlYWQiLCJleHAiOjQ2ODM4MDUxNDF9.h-j6FKRFdnTdmAueTZCdep45e6DPwqM68ZQ8doIJ1exi9YxAlbWzOwId6Bd0L5YmCmp63gGQgsBUBLzwnZQ8kLUgUOBEC3UzSWGRqMskCY9_k9pX0iomX6IfF3N0PaYs0WPC4hO1s8wfZQ-6hKQ4KigFi13G9LMLdH58PRMK0pKEvs3gCbHJuEPw-K5ORlpdnleUTQIwINafU57cmK3KocTeknPAM_L716sCuSYGvDl6xUTXO7oPdrXhS_EhxLP6KxrpI1uD4Ea_5OWTh7S0Wx5LLDfU6wBG1DowN20d374zepOIEkR-Jnmr_QlR44vmRqS5ncrF-1R0EGcPX49U6A";

  @Autowired
  MockMvc mvc;

  @Test
  public void performWhenValidBearerTokenThenAllows()
      throws Exception {

    this.mvc.perform(get("/api/users/me").with(bearerToken(this.noScopesToken)))
        .andExpect(status().isOk())
        .andExpect(content().string(containsString("Hello, subject!")));
  }

  // -- tests with scopes

  @Test
  public void performWhenValidBearerTokenThenScopedRequestsAlsoWork()
      throws Exception {

    this.mvc.perform(get("/people").with(bearerToken(this.messageReadToken)))
        .andExpect(status().isOk())
        .andExpect(content().string(containsString("secret message")));
  }

  @Test
  public void performWhenInsufficientlyScopedBearerTokenThenDeniesScopedMethodAccess()
      throws Exception {

    this.mvc.perform(get("/message").with(bearerToken(this.noScopesToken)))
        .andExpect(status().isForbidden())
        .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE,
            containsString("Bearer error=\"insufficient_scope\"")));
  }

  private static class BearerTokenRequestPostProcessor implements RequestPostProcessor {
    private String token;

    public BearerTokenRequestPostProcessor(String token) {
      this.token = token;
    }

    @Override
    public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
      request.addHeader("Authorization", "Bearer " + this.token);
      return request;
    }
  }

  private static BearerTokenRequestPostProcessor bearerToken(String token) {
    return new BearerTokenRequestPostProcessor(token);
  }
}
