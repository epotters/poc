package poc.test.features;


import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import org.springframework.http.HttpStatus;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;


public class StepDefinitions extends SpringIntegrationTest {

  private final String baseUrl = "http://localhost:8002/poc/api";


  @When("^the client calls (.+)$")
  public void the_client_calls_url(String relativeUrl) throws Throwable {
    executeGet(baseUrl + relativeUrl);
  }


  @Then("^the client receives status code of (\\d+)$")
  public void the_client_receives_status_code_of(int statusCode) throws Throwable {
    final HttpStatus currentStatusCode = latestResponse.getTheResponse().getStatusCode();
    assertThat("status code is incorrect : " + latestResponse.getBody(), currentStatusCode.value(), is(statusCode));
  }


  @And("^the client receives application name (.+)$")
  public void the_client_receives_server_version_body(String applicationName) throws Throwable {
    assertThat(latestResponse.getBody(), is(applicationName));
  }
}
