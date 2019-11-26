import { Dict } from '@mohism/utils';

export const DEPS_LINT: Array<string> = [
  'eslint',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
];

export const SCRIPTS_LINT: Dict<string> = {
  'lint': 'npx eslint src/**/*.ts --cache --fix',
};

export const ESLINTRC: string =
  `{
"env": {
    "es6": true,
    "node": true
},
"extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
],
"globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
},
"parser": "@typescript-eslint/parser",
"parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
},
"plugins": [
    "@typescript-eslint"
],
"rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "indent": [
        "error",
        2
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "always"
    ]
}
}`;