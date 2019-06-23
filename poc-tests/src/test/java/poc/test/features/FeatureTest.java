package poc.test.features;


import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;


@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/poc/test/features",
    glue = "StepDefinitions",
    plugin = {"pretty",
        "html:target/cucumber-reports/cucumber-pretty",
        "json:target/cucumber-reports/cucumber-test-report.json",
        "rerun:target/cucumber-reports/re-run.txt"})
public class FeatureTest {
}
