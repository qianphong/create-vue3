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
const templates = [
  {
    name: '普通模板',
    git: 'https://github.com/qianphong/vite-basic-template.git',
  },
  {
    name: '大屏模板',
    git: 'https://github.com/qianphong/view-template.git',
  },
]
try {
  prompts(
    [
      {
        type: 'select',
        name: 'type',
        message: '选择模板类型',
        choices: templates.map((item, index) => ({
          title: item.name,
          value: index,
        })),
        initial: 1,
      },
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
    const { projectName, overwrite, packageName, type } = res
    const root = path.join(cwd, projectName)

    if (overwrite) emptyDir(root)
    else if (!fs.existsSync(root)) fs.mkdirSync(root)

    const repo = templates[type]?.git
    if (!repo) throw new Error('模板不存在')

    const spinner = ora(`\nScaffolding project in ${root}...`)
    spinner.start()

    cloneRepo(repo, projectName, { shallow: true })

    rimraf([path.join(root, './.git'), path.join(root, './.github')])

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
