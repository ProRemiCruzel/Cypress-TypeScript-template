import { Before } from '@badeball/cypress-cucumber-preprocessor';
import { Post } from 'support/types/globals';
import { JSONPlaceholderEndpoints } from '@constants/globals';

Before({ name: 'Create random post', order: 0, tags: '@require-post' }, function () {
  const newPost: Post = {
    title: 'foo',
    body: 'bar',
    userId: 1,
  };

  cy.sendQuery({
    method: 'POST',
    repo: 'JSON_PLACEHOLDER',
    endpoint: JSONPlaceholderEndpoints['POSTS'],
    body: newPost,
  }).then(function (response) {
    cy.wrap(response.body).as('currentPost');
  });
});
