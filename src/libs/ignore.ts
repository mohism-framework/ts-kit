import { Dict } from '@mohism/utils';

export const GIT_IGNORE: Array<string> = [
  'node_modules',
  'dist',
  'tsconfig.tsbuildinfo',
  '.nyc_output',
  'coverage',
  '.eslintcache',
];

export const NPM_IGNORE: Array<string> = [
  'src',
  'node_modules',
  'tsconfig.json',
  '*.map',
  '.nyc_output',
  'coverage',
];

export const IGNORE_FILES: Dict<Array<string>> = {
  '.gitignore': GIT_IGNORE,
  '.npmignore': NPM_IGNORE,
};