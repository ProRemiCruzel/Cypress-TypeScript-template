/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const envfile = require('envfile');

async function chalk() {
  return (await import('chalk')).default;
}

const AVAILABLE_ENVIRONMENTS = [
  {
    text: 'staging - fictional',
    color: '#2dc733',
    JSON_PLACEHOLDER_BASE_URL: 'https://staging.jsonplaceholder.typicode.com',
  },
  {
    text: 'preproduction - fictional',
    color: '#d37734',
    JSON_PLACEHOLDER_BASE_URL: 'https://preprod.jsonplaceholder.typicode.com',
  },
  {
    text: 'production',
    color: '#c91e1e',
    JSON_PLACEHOLDER_BASE_URL: 'https://jsonplaceholder.typicode.com',
  },
];

const AVAILABLE_LANGUAGES = [
  {
    text: 'fr',
    color: '#586bdc',
  },
  {
    text: 'en',
    color: '#cd1515',
  },
];

function getEnvConfig(targetEnv) {
  return AVAILABLE_ENVIRONMENTS.find((env) => env.text === targetEnv);
}

function loadEnvFile() {
  return require('fs').readFileSync(require('path').resolve(__dirname, '../.env')).toString();
}

function saveEnvFile({ payload }) {
  require('fs').writeFileSync(require('path').resolve(__dirname, '../.env'), payload);
}

function previewEnv(title, config) {
  console.log(`\n${title}`);
  const output = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  console.log(output);
}

exports.bootstrap = function bootstrapSwitchEnv(program) {
  program
    .command('switch-env')
    .description(`Lets you target different environment, handling .env files modification for you`)
    .option('-e, --environment <env>', 'Target a specific environment')
    .option('-l, --language <lang>', 'Target a specific language')
    .action(async (options) => {
      let targetEnv;
      if (!options.environment) {
        const prompts = require('prompts');

        const choices = await Promise.all(
          AVAILABLE_ENVIRONMENTS.map(async ({ text, color }) => {
            const title = (await chalk()).hex(color).bold(text);

            return {
              title,
              description: `Switch to ${title} environment`,
              value: text,
            };
          }),
        );

        const response = await prompts({
          type: 'select',
          name: 'env',
          message: 'Select an environment',
          choices,
          initial: 0,
        });

        targetEnv = response.env;
      } else {
        targetEnv = options.environment;
      }

      let targetLang;
      if (!options.language) {
        const prompts = require('prompts');

        const choices = await Promise.all(
          AVAILABLE_LANGUAGES.map(async ({ text, color }) => {
            const title = (await chalk()).hex(color).bold(text);

            return {
              title,
              description: `Switch to ${title} language`,
              value: text,
            };
          }),
        );

        const response = await prompts({
          type: 'select',
          name: 'lang',
          message: 'Select a language',
          choices,
          initial: 0,
        });

        targetLang = response.lang;
      } else {
        targetLang = options.language;
      }

      const envConfig = {
        LOCALE: targetLang,
        JSON_PLACEHOLDER_BASE_URL: getEnvConfig(targetEnv).JSON_PLACEHOLDER_BASE_URL,
      };

      const parsedEnv = {
        ...envfile.parse(loadEnvFile()),
        ...envConfig,
      };

      saveEnvFile({ payload: envfile.stringify(parsedEnv) });

      console.log((await chalk()).blue('The following modification have been applied:'));

      previewEnv((await chalk()).green('> cypress-typescript-template'), envConfig);
    });
};
