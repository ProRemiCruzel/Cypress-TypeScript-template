import { Query } from 'support/types/globals';

Cypress.Commands.add(
  'random',
  {
    prevSubject: true,
  },
  (subject) => {
    return Cypress._.sample(subject);
  },
);

Cypress.Commands.add('sendQuery', function (query: Query) {
  return cy
    .request({
      method: query.method,
      url: Cypress.env(query.repo) + query.endpoint,
      body: query.body || undefined,
    })
    .then(function (response) {
      cy.wrap(response).as('lastQueryResponse');
      return response;
    });
});
