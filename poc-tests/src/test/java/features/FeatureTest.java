package features;


import org.junit.runner.RunWith;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;


@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue="StepDefinitions",
    format=
        {"pretty",
            "html:target/cucumber-reports/cucumber-pretty",
            "json:target/cucumber-reports/CucumberTestReport.json",
            "rerun:target/cucumber-reports/re-run.txt"})
public class FeatureTest {
}
