import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
import { defineConfig } from 'cypress';
import { config } from 'dotenv';

config();

async function setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  await addCucumberPreprocessorPlugin(on, config);
  on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
  return config;
}

module.exports = defineConfig({
  projectId: '',
  scrollBehavior: 'center',
  defaultCommandTimeout: 5000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  retries: {
    openMode: 0,
    runMode: 2,
  },
  env: {
    LOCALE: process.env.LOCALE,
    JSON_PLACEHOLDER: process.env.JSON_PLACEHOLDER_BASE_URL,
  },
  e2e: {
    specPattern: './**/*.feature',
    supportFile: './cypress/support/index.ts',
    setupNodeEvents,
  },
});
