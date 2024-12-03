Feature: Comments

  Scenario: Retrieve all comments
    Given A GET query on JSON_PLACEHOLDER
    And It targets COMMENTS
    When Query is sent
    Then Status code should be 200
    And Response body array length should be 500