import fs from 'fs'
import path from 'path'
import ora from 'ora'
import minimist from 'minimist'
import prompts from 'prompts'

import logger from './shared/logger'
import { cloneRepo } from './shared/cloneRepo'
import {
  emptyDir,
  isEmpty,
  isValidPackageName,
  rimraf,
  toValidPackageName,
  writePkg,
} from './shared/utils'

const argv = minimist(process.argv.slice(2), { boolean: true })
const cwd = process.cwd()
const targetDir = argv._[0] || ''

try {
  prompts(
    [
      {
        type: 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: targetDir || 'vue3-project',
      },
      {
        type: (_, { projectName }) => {
          return !fs.existsSync(projectName) || isEmpty(projectName)
            ? null
            : 'confirm'
        },
        name: 'overwrite',
        message: value =>
          targetDir === '.'
            ? 'Current directory'
            : `Target directory "${value}"` +
              'is not empty. Remove existing files and continue?',
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            logger.error('× Operation cancelled')
            process.exit(1)
          }
          return null
        },
        name: 'overwriteChecker',
      },
      {
        type: (_, { projectName }) =>
          isValidPackageName(projectName) ? null : 'text',
        name: 'packageName',
        message: 'package name:',
        initial: (_, { projectName }) => toValidPackageName(projectName),
        validate: dir => isValidPackageName(dir) || 'Invalid package.json name',
      },
    ],
    {
      onCancel: () => {
        logger.error('× Operation cancelled')
        process.exit(1)
      },
    },
  ).then(res => {
    const { projectName, overwrite, packageName } = res
    const root = path.join(cwd, projectName)

    if (overwrite) emptyDir(root)
    else if (!fs.existsSync(root)) fs.mkdirSync(root)

    const spinner = ora(`\nScaffolding project in ${root}...`)
    spinner.start()

    cloneRepo(
      'https://github.com/qianphong/vite-basic-template.git',
      projectName,
      { shallow: true },
    )

    rimraf(path.join(root, './.git'))

    writePkg(path.join(root, './package.json'), {
      name: packageName || projectName,
      version: '1.0.0',
    })

    spinner.succeed('Done. Now run:')

    if (root !== cwd) logger.success(`  cd ${path.relative(cwd, root)}`)

    logger.success('  pnpm')
    logger.success('  pnpm dev')
  })
} catch (cancelled: any) {
  logger.error(cancelled.message)
}
