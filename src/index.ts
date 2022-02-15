import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import prompts from 'prompts'
import logger from './shared/logger'
import { cloneRepo } from './shared/cloneRepo'
import {
  rimraf,
  emptyDir,
  isEmpty,
  toValidPkgName,
  writePkg,
} from './shared/utils'
import templates from './const/templates'

const argv = minimist(process.argv.slice(2), { boolean: true })
const cwd = process.cwd()
const targetDir = argv._[0] || ''

try {
  prompts(
    [
      {
        type: 'select',
        name: 'type',
        message: 'Select template',
        choices: templates.map((item, index) => ({
          title: item.name,
          value: index,
        })),
        initial: 0,
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
    ],
    {
      onCancel: () => {
        logger.error('× Operation cancelled')
        process.exit(1)
      },
    },
  ).then(res => {
    const { type, projectName, overwrite } = res
    const root = path.join(cwd, projectName)

    if (overwrite) emptyDir(root)
    else if (!fs.existsSync(root)) fs.mkdirSync(root)

    const repo = templates[type]?.git
    if (!repo) throw new Error('Template does not exist')

    cloneRepo(repo, projectName, { shallow: true })

    rimraf(
      [path.join(root, './.git'), path.join(root, './.github')].filter(p =>
        fs.existsSync(p),
      ),
    )

    writePkg(path.join(root, './package.json'), {
      name: toValidPkgName(projectName),
      version: '1.0.0',
    })

    logger.success('Done. Now run:')
    if (root !== cwd) logger.success(`  cd ${path.relative(cwd, root)}`)
    logger.success('  pnpm')
    logger.success('  pnpm dev')
  })
} catch (cancelled: any) {
  logger.error(cancelled.message)
}
