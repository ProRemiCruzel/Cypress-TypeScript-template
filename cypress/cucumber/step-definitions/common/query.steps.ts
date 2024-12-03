import { defineParameterType, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { JSONPlaceholderEndpoints } from '@constants/globals';
import { ApiRepo, Endpoint, QueryMethod } from 'support/types/globals';

const combinedEndpoints = [...Object.keys(JSONPlaceholderEndpoints)];

defineParameterType({
  name: 'queryMethod',
  regexp: /GET|POST|PUT|PATCH|DELETE/,
  transformer: (s) => s,
});

defineParameterType({
  name: 'apiRepo',
  regexp: /JSON_PLACEHOLDER/,
  transformer: (s) => s,
});

// https://youtrack.jetbrains.com/issue/WEB-53093/cucumber.js-plugin-support-matching-type-defined-with-RegExp-object
defineParameterType({
  name: 'endpoint',
  regexp: new RegExp(combinedEndpoints.join('|')),
  transformer: (s) => s,
});

Given('A {queryMethod} query on {apiRepo}', function (queryMethod: QueryMethod, apiRepo: ApiRepo) {
  this.currentQueryMethod = queryMethod;
  this.currentApiRepo = apiRepo;

  this.currentQuery = {
    method: this.currentQueryMethod,
    repo: this.currentApiRepo,
  };
});

Given('It targets {endpoint}', function (endpoint: Endpoint) {
  if (this.currentQuery === undefined) throw new Error('A query must be defined first');
  switch (this.currentQuery.repo) {
    case 'JSON_PLACEHOLDER':
      this.currentQuery.endpoint = JSONPlaceholderEndpoints[endpoint];
  }
});

Given('With path parameter {string}', function (pathParam: string) {
  if (this.currentQuery.endpoint === undefined)
    throw new Error('A query endpoint must be defined first');
  this.currentQuery.endpoint = this.currentQuery.endpoint.concat(pathParam);
});

Given('With body', function (body: string) {
  this.currentQuery.body = JSON.parse(body);
});

When('Query is sent', function () {
  cy.sendQuery(this.currentQuery);
});

Then('Status code should be {int}', function (statusCode: number) {
  if (this.lastQueryResponse === undefined) throw new Error('A query must be sent first');
  expect(this.lastQueryResponse.status).to.equal(statusCode);
});

Then('Response body array length should be {int}', function (arrayLength: number) {
  if (this.lastQueryResponse === undefined) throw new Error('A query must be sent first');
  expect(this.lastQueryResponse.body).to.have.length(arrayLength);
});
