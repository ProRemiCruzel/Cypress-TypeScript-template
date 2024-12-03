/// <reference types="cypress" />
import { ApiRepo, Post, Query, QueryMethod } from '@types/globals.d';

declare global {
  namespace Mocha {
    interface Context {
      currentQueryMethod: QueryMethod;
      currentApiRepo: ApiRepo;
      currentQuery: Query;
      currentPost: Post;
      lastQueryResponse: Cypress.Response<object>;
    }
  }
  namespace Cypress {
    interface Chainable {
      random(): Chainable;
      sendQuery(query: Query): Chainable<Cypress.Response<object>>;
    }
  }
}
