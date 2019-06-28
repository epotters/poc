package poc.test.features.steps;


import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import poc.test.features.pages.KeycloakLoginPage;

import static org.assertj.core.api.Assertions.assertThat;
import static poc.test.features.DriverHooks.DRIVER;


public class StepDefinitions extends SpringIntegrationTest {



  @When("the client calls {string}")
  public void the_client_calls_url(String relativeUrl) throws Throwable {
    executeGet(baseUrl + relativeUrl);
  }


  @Then("^the client receives status code of (\\d+)$")
  public void the_client_receives_status_code_of(int statusCode) throws Throwable {
    latestResponse.expectStatus().isOk();
  }


  @And("the client receives application status {string}")
  public void the_client_receives_server_version_body(String applicationStatus) throws Throwable {
//    String expectedResponse = "{\"status\":\"UP\"}";
//    latestResponse.expectBody(String.class).isEqualTo(expectedResponse);

    String expectedStatus = "UP";
    latestResponse
        .expectBody()
        .jsonPath("$.status").isNotEmpty()
        .jsonPath("$.status").isEqualTo(expectedStatus);
  }


  // OIDC Login

  @Given("the user is not logged in yet")
  public void the_user_is_not_logged_in_yet() {
    // TODO: Check this somehow, logout when necessary
  }

  @When("the user requests protected resource {string}")
  public void the_user_requests_protected_resource(String protectedResourceUrl) {
    DRIVER.navigate().to(protectedResourceUrl);
  }


  @Then("the user receives an unauthorized notice")
  public void the_user_receives_an_unauthorized_notice() {

  }


  @Then("the user is redirected to the authorization server's login page")
  public void the_user_is_redirected_to_the_authorization_server_s_login_page() throws Exception {
    KeycloakLoginPage loginPage = new KeycloakLoginPage();
    assertThat(loginPage.verifyPage());
  }

  @When("the user logs in")
  public void the_user_logs_in() throws Exception {
    KeycloakLoginPage loginPage = new KeycloakLoginPage();
    if (loginPage.verifyPage()) {
      loginPage.login("eelko", "12345");
    }
  }

  @Then("the user is redirected to the protected resource")
  public void the_user_is_redirected_to_the_protected_resource() {
  }
}
