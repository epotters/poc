
Feature: The user can retieve basic information about the POC application
  Scenario: client makes call to GET /info
    When the client calls /info
    Then the client receives status code of 200
    And the client receives application name poc