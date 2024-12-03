# Cypress-TypeScript Framework template

## Installation

You can install all dependencies with `npm install`

# How to write your tests

## Core concepts

Before writing and maintaining end-to-end tests with Cypress, it is rigorously important to understand some of its core
concepts.

* #### [Mocha context](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Sharing-Context)
* #### [Test isolation](https://docs.cypress.io/guides/core-concepts/test-isolation)
* #### [Tags and hooks](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks)
* #### [Asynchronous nature and Cypress chain of commands](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

## Use cucumber
Use cases and specification are widely written using Cucumber's Gherkin language. In accordance, it is a must to use the same language when creating and implementing automated tests.
This will improve the reusability of the implemented tests, and it will let them become understandable by everyone.
* #### [Gherkin language - best practices](https://cucumber.io/docs/bdd/better-gherkin/)

## Control the state of your tests using tags and hooks
Tests should be written in order to verify one or more rule / use case. Often, those use cases will have various requirement, that could be a specific data, or a specific state of the application under tests : A user, a post, specific rights or specific configuration, etc.
Those are described as "requirements", but are not within the scope of the test. They are not included within the **subject of the test**

In order to lighten and shorten the Gherkin scenarios, it is considered to be a good practice to extrude the code used to fulfill those requirements from the Gherkin scenario, using cucumber tags and hooks.

As an example, consider the following rule:
**When deleting a user account, the user should be prompted to enter the password to confirm deletion.**

This rule, tells in an implicit manner that we need a user account, to verify the process of its deletion.
* The user account is a requirement
* The account deletion process is the subject of the test

Considering this, one implementation that would be considered **efficient and respectful of our good practices** could be this one:

```gherkin
@require-user-account
Given A logged user
When I want to delete my user account
Then I should be prompted to input my password
```

Always consider your test to start from an "empty" state, meaning that every required data is not yet existing.
It means that the user account that we **require** to test our **test subject** does not exist by default. We must explicitly indicate that we have to create it before that test start, by affixing the scenario with a tag `@require-user-account`

By attaching this tag to our test, a hook could automatically run before the test to ensure data is created and available, like so:

```typescript
Before({ tags: '@require-user-account' }, function() {
  cy.createUserAccount()
});
```

This will have for advantage:
* Reduce execution time using webServices
* Reduce dependencies of your tests
* Lighten Gherkin and improve readability
* Improve modularity of your tests by implementing generic blocks

## Organize your pages and components
In order to reduce maintenance costs for the automated tests, it is strongly recommended to centralize the definition of all the locators of components and webElements that the Cypress automaton aims to interact with.

* #### [Cypress best practices - Selecting Elements](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements)

# How to run the tests

## Open mode vs run mode

Cypress is designed in such a way that you have two modes to run your tests on your machine.

In `run` mode, your tests will be run within a terminal, and the driver cypress will use will be by default in
a `headless` mode, meaning that no physical instance of the driver and cypress UI will exist.
This mode is mainly used by the CI that runs the tests (gitlab CI)

In `open` mode, mainly used for debugging purposes and test conception, your tests will be run within the cypress UI,
letting you chose which available driver you want to instantiate, that will exist in a `headed` mode.

## Target env

Written tests are designed to be capable of running on multiple environments and multiple locales.
For that purpose, you can use the following command to set your environment and locale in a console interface:

```sh
npm run switch-env
```

This command can also be called with arguments to avoid console interface:

```sh
npm run switch-env -- -e "production" -l "fr"
```

# Best practices
## Tests must not be dependant from environment or data
One of the most challenging task to keep in mind when creating automated tests, is reducing code to the lowest dependency level possible.

### High dependency result in high development costs and even higher maintenance costs!

To reduce data and environment dependencies always avoid to create tests that rely on static data.
Instead of implementing references to **normally existing data**, prefer implementing a way of creating your own data.

## Keep in mind that the test duration should always be as short as possible
In a scaling project, test duration should always be aimed to be the shortest.

With that state of mind, please avoid every use of "static waits" such as `cy.wait(500)`
Those can be useful, especially when Cypress is trying to go too fast and results in a failing test, but 100% of the time, this static duration is more than what is really necessary, whether it is 450ms or 1ms too long.

In replacement of a static wait, prefer the use of what are called "dynamic waits" that will last until either conditions are met or timeout has been reached.
Those can be, for example:
* Waiting for the visibility of a WebElement contained within the DOM of a specific page to ensure it is loaded
* Waiting for an element to have a certain attribute or property
* Intercepting and waiting a REST call (can be an XHR request) to ensure data fetching has been done

### [`cy.wait()` should almost never be needed](https://docs.cypress.io/guides/references/best-practices#Unnecessary-Waiting)

## [Tests must not rely on another test and should always be capable of running in isolation](https://docs.cypress.io/guides/references/best-practices#Having-Tests-Rely-On-The-State-Of-Previous-Tests)
In a low dependency level state of mind, be mindful of dependencies between tests.
It is considered to be a bad practice to have a test rely on another one to be able to run correctly.

### Tests should always be able to be run with a @focus and still pass

## [Prefer end-to-end tests to tiny tests with a single assertion](https://docs.cypress.io/guides/references/best-practices#Creating-Tiny-Tests-With-A-Single-Assertion)
Why is it considered to be better:

* When considering that a test always start from an "empty state", that means that it should always create data and set up the application state to meet the requirements for the test.

## [In most cases, conditional testing isn't compatible with Cypress nature](https://docs.cypress.io/guides/core-concepts/conditional-testing)
Cypress state of mind is to place all its money on **deterministic tests**
What it essentially means, is that automated tests should always have a deterministic behaviour. The same test should always have the same result, the expected one.

What Cypress calls "**conditional testing**" is basically: `if X, then Y, else Z`.

Take as an example a random popup that **might pop** randomly. With this in mind, what we could be tempted to do might be to "test" if this popup appears, with conditions like `if/else` or maybe try to get the popup and close it, and catch if it does not appear then continue.

**This is neither natively possible nor encouraged by Cypress**: making this possible would be the entry point of permitting to write **non-deterministic tests**.

A non-deterministic test is basically something that we cannot **precisely predict** what it will do. Will it encounter the random popup and react with it, or not, we don't know.
This really is the essence of what is called a **flaky test**: Flakiness of a test is defined by how much "unpredictable" the test is without being modified.
By definition then, a test that could lead to more than one behaviour when executed multiple times without being modified is considered to be **flaky**

### Absolutely avoid flaky tests when possible

To avoid flaky tests, many times what is possible to do is to **take control of the state of the application**

Take once more the example of a random popup, instead of thinking of a way to be able to react whether it appears or not, prefer an approach where you can control whether you want it to appear or not:
* Take a look into url params
* Set a cookie to a specific value
* Call an api to control what you want

## [Clean up `before` the test rather than `after`](https://docs.cypress.io/guides/references/best-practices#Using-after-Or-afterEach-Hooks)

As a reminder, a test starting from an empty state, every data requirement (account, configuration, etc...) have to be created beforehand.
Consequently, automated tests are quite heavy on the database and can really be impactful in terms of environment and database performances on big projects.

While it can be understandable to want to clean the created data when it is not needed anymore, in other terms, **after the test**, it is also considered to be a bad practice.

Cleaning data and application state when test has passed is very useful, it saves a lot of memory and prevent performance loss in the long term.
But, running this as a "post test treatment" also means that, if for whatever reason (crash, unexpected error, network issues...) the test does not complete successfully, it also means that, very probably, this post-treatment won't run as expected.
Even if it does run like expected, but application state / data is not as expected because of previous issues, it could lead to unexpected results.

Taking this into consideration, it really is considered to be better to clean your application state and data **before** the test is run, and obviously, **before the required data for the test is created** to avoid cleaning just created necessary data.
