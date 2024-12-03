import { Step, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('Created post should be correct', function () {
  this.currentPost = Object.assign(this.currentQuery.body, this.lastQueryResponse.body);
  expect(this.currentPost).to.deep.equal(this.lastQueryResponse.body);
});

When('A delete query is sent on the created post', function () {
  Step(this, 'A DELETE query on JSON_PLACEHOLDER');
  Step(this, 'It targets POSTS');
  Step(this, `With path parameter "/${this.currentPost.id}"`);
  Step(this, 'Query is sent');
});
