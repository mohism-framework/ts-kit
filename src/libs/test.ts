import { Dict } from '@mohism/utils';

/**
 * 测试套件
 */
export const DEPS_TEST: Array<string> = [
  'mocha',
  '@types/mocha',
  'chai',
  '@types/chai',
  'nyc',
];


export const SCRIPTS_TEST: Dict<string> = {
  'cover': 'npx nyc npm test',
  'test': 'npx mocha --recursive -r ts-node/register test/**/*.spec.ts',
};

export const NYC_RC: string =
  `{
  "cache": false,
  "check-coverage": false,
  "extension": [
    ".ts"
  ],
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "coverage/**",
    "node_modules/**",
    "**/*.d.ts",
    "**/*.spec.ts"
  ],
  "sourceMap": true,
  "reporter": [
    "html",
    "text",
    "text-summary"
  ],
  "all": true,
  "instrument": true
}`;