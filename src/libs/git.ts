import { Dict } from '@mohism/utils';

/**
 * git 套件
 */
export const DESP_GIT: Array<string> = [
  'husky'
];

export const gitSetting = (lintKit: boolean, testKit: boolean): Dict<Dict<Dict<string>>> => {
  const stages:Array<string> = [];
  lintKit && stages.push('npm run lint');
  testKit && stages.push('npm test');
  return {
    'husky': {
      'hooks': {
        'pre-commit': stages.join(' & ')
      }
    },
  };
};