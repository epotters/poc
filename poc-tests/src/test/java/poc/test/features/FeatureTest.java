package poc.test.features;


import cucumber.api.CucumberOptions;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;
import poc.test.features.pages.BasePage;


@RunWith(Cucumber.class)
@CucumberOptions(
    features = {"src/test/resources/poc/test/features"},
    glue = {"poc.test.features.steps"},
    plugin = {"pretty",
        "html:target/cucumber-reports/cucumber-pretty",
        "json:target/cucumber-reports/cucumber-test-report.json",
        "rerun:target/cucumber-reports/re-run.txt"},
    tags = "@wip")
public class FeatureTest {
}
