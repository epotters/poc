@wip
Feature: The user can retieve the status of the POC application
  Scenario: client makes call to check the application's status
    When the client calls '/actuator/health'
    Then the client receives status code of 200
    And the client receives application status 'UP'
