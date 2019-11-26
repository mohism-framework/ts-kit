import ActionBase from '@mohism/cli-wrapper/dist/libs/action.class';
import { ArgvOption } from '@mohism/cli-wrapper/dist/libs/utils/type';
import { Dict } from '@mohism/utils';
import { white } from 'colors';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { exec } from 'shelljs';

import { IGNORE_FILES } from '../libs/ignore';
import { DEPS_LINT, ESLINTRC, SCRIPTS_LINT } from '../libs/lint';
import { DEPS_TEST, NYC_RC, SCRIPTS_TEST } from '../libs/test';
import { DEPS_DEV, SCRIPTS_TS, TSCONFIG } from '../libs/typescript';
import { gitSetting, DESP_GIT } from '../libs/git';

class TsKit extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return 'an awesome typescript kit';
  }

  async run(): Promise<any> {
    const testKit = await this.question.confirm('安装测试套件？', true);
    const lintKit = await this.question.confirm('安装 eslint 套件？', true);
    const gitKit = await this.question.confirm('安装 git辅助 套件？', true);
    // 要运行kit的项目位置
    const root: string = process.cwd();
    if (!existsSync(`${root}/package.json`)) {
      if (0 !== exec('npm init --yes', {
        silent: true,
      }).code) {
        this.fatal('Run "npm init" failed.');
      }
      this.info(`Successful generate: ${white(`${root}/package.json`)}`);
    }
    let pkg = require(`${root}/package.json`);
    // add npm scripts
    pkg.scripts = {
      ...pkg.scripts,
      ...SCRIPTS_TS,
      ...(testKit ? SCRIPTS_TEST : []),
      ...(lintKit ? SCRIPTS_LINT : []),
    };
    if (gitKit) {
      pkg = {
        ...pkg,
        ...gitSetting(lintKit, testKit),
      };
    }
    writeFileSync(`${root}/package.json`, JSON.stringify(pkg, null, 2));
    this.info('Successful update npm scripts');

    // mkdir
    if (!existsSync(`${root}/src`)) {
      mkdirSync(`${root}/src`);
    }
    if (!existsSync(`${root}/dist`)) {
      mkdirSync(`${root}/dist`);
    }
    if (!existsSync(`${root}/test`)) {
      mkdirSync(`${root}/test`);
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
      this.info(`Successful updated: ${white(file)}`);
    });

    // eslintrc
    if (lintKit && !existsSync(`${root}/.eslintrc.json`)) {
      writeFileSync(`${root}/.eslintrc.json`, ESLINTRC);
      this.info(`Successful generate: ${white('.eslintrc.json')}`);
    }

    // .nycrc
    if (testKit && !existsSync(`${root}/.nycrc`)) {
      writeFileSync(`${root}/.nycrc`, NYC_RC);
      this.info(`Successful generate: ${white('.nycrc')}`);
    }

    // tsconfig
    if (!existsSync(`${root}/tsconfig.json`)) {
      writeFileSync(`${root}/tsconfig.json`, TSCONFIG);
      this.info(`Successful generate: ${'tsconfig.json'.white}`);
    }

    // install deps
    let toInstall = [
      ...DEPS_DEV,
      ...(testKit ? DEPS_TEST : []),
      ...(lintKit ? DEPS_LINT : []),
      ...(gitKit ? DESP_GIT : []),
    ]
      .filter(item => !pkg.devDependencies || !pkg.devDependencies[item])
      .join(' ');

    if (toInstall.length > 0) {
      this.info('wait for install dependencies ...'.white);
      if (0 !== exec(`npm i -D ${toInstall}`, { silent: true }).code) {
        this.fatal('Dependencies fail to installed, it will finished in few mins');
      }
    }
    this.info(`Successful install: ${toInstall.white}`);
  }
}

export default new TsKit();