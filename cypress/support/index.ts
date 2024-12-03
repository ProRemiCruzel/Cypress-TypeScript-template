/// <reference types="cypress" />
import './commands.ts';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

Cypress.on('uncaught:exception', () => {
  return false;
});

export {};
