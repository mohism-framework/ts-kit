import ActionBase from '@mohism/cli-wrapper/dist/libs/action.class';
import { ArgvOption, Dict } from '@mohism/cli-wrapper/dist/libs/utils/type';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { EOL } from 'os';
import { exec } from 'shelljs';

import { DEPS_DEV, ESLINTRC, IGNORE_FILES, SCRIPTS } from '../libs/constant';

import('colors');

class TsKit extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return 'an awesome typescript kit';
  }

  async run(): Promise<any> {
    // 要运行kit的项目位置
    const root: string = process.cwd();
    if (!existsSync(`${root}/package.json`)) {
      if (0 !== exec('npm init --init', {
        silent: true,
      }).code) {
        this.fatal('Run "npm init" failed.');
      }
      this.info(`Successful generate: ${`${root}/package.json`.white}`);
    }
    const pkg = require(`${root}/package.json`);
    // add npm scripts
    pkg.scripts = { ...pkg.scripts, ...SCRIPTS };
    writeFileSync(`${root}/package.json`, JSON.stringify(pkg, null, 2));
    this.info(`Successful update scripts: ${'npm run build, npm run lint'.white}`);

    // mkdir
    if (!existsSync(`${root}/src`)) {
      mkdirSync(`${root}/src`);
    }
    if (!existsSync(`${root}/dist`)) {
      mkdirSync(`${root}/dist`);
    }

    // ignore file
    Object.keys(IGNORE_FILES).forEach(file => {
      let ignore: Set<string> = new Set(IGNORE_FILES[file]);
      if (existsSync(`${root}/${file}`)) {
        ignore = new Set([
          ...readFileSync(`${root}/${file}`).toString().split(EOL),
          ...IGNORE_FILES[file],
        ]);
      }
      writeFileSync(`${root}/${file}`, Array.from(ignore).join(EOL));
      this.info(`Successful updated: ${`${file}`.white}`);
    });

    // eslintrc
    if (!existsSync(`${root}/.eslintrc.json`)) {
      writeFileSync(`${root}/.eslintrc.json`, ESLINTRC);
      this.info(`Successful generate: ${'.eslintrc.json'.white}`);
    }

    // tsconfig
    if (!existsSync(`${root}/tsconfig.json`)) {
      writeFileSync(`${root}/tsconfig.json`, ESLINTRC);
      this.info(`Successful generate: ${'tsconfig.json'.white}`);
    }

    // install deps
    const toInstall = DEPS_DEV
      .filter(item => !pkg.devDependencies || !pkg.devDependencies[item])
      .join(' ');
    if (toInstall.length > 0) {
      this.info('wait for install dependencies ...'.white);
      if (0 !== exec(`npm i -D ${toInstall}`, { silent: true }).code) {
        this.fatal('Dependencies fail to installed');
      }
    }
    this.info(`Successful install: ${toInstall.white}`);
  }
}

export default new TsKit();