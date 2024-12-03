Feature: Posts

  Scenario: Retrieve all posts
    Given A GET query on JSON_PLACEHOLDER
    And It targets POSTS
    When Query is sent
    Then Status code should be 200
    And Response body array length should be 100

  Scenario: Create a new post
    Given A POST query on JSON_PLACEHOLDER
    And It targets POSTS
    And With body
    """
      {
        "title" : "foo",
        "body" : "bar",
        "userId" : 1
      }
    """
    When Query is sent
    Then Status code should be 201
    And Created post should be correct

  @require-post
  Scenario: Delete a post
    When A delete query is sent on the created post
    Then Status code should be 200