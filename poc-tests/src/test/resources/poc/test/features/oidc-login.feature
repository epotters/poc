@wip
Feature: The user can login and request a protected resource

  Scenario Outline: user logs in
    Given the user is not logged in yet
    When the user requests protected resource '<URL>'
    Then the user receives an unauthorized notice

    Then the user is redirected to the authorization server's login page
    When the user logs in
    Then the user is redirected to the protected resource

    Examples:
      | URL                                    | Expected result |
      | http://localhost:4200                  | eelko           |
      | https://whoami.localhost               | eelko           |
      | http://localhost:8002/poc/api/users/me | eelko           |



