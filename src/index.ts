import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import minimist from 'minimist'
import prompts from 'prompts'
import defaultPkgInfo from '../template/package.json'
import logger from './shared/logger'
import {
  createWriteFn,
  emptyDir,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  toValidPackageName,
} from './shared/utils'

const argv = minimist(process.argv.slice(2), { boolean: true })
const cwd = process.cwd()
const targetDir = argv._[0] || ''

const __dirname = fileURLToPath(import.meta.url)
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
            : `Target directory "${value}"`
            + 'is not empty. Remove existing files and continue?',
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
  ).then((res) => {
    const { projectName, overwrite, packageName } = res
    const root = path.join(cwd, projectName)

    if (overwrite) emptyDir(root)
    else if (!fs.existsSync(root)) fs.mkdirSync(root)

    const spinner = ora(`\nScaffolding project in ${root}...`)
    spinner.start()

    const templateDir = path.join(__dirname, '../../template')
    const write = createWriteFn(root, templateDir, {
      renameFiles: {
        _gitignore: '.gitignore',
        _eslintrc: '.eslintrc',
        _eslintignore: '.eslintignore',
      },
    })
    fs.readdirSync(templateDir).forEach(file => write(file))
    const pkg = {
      ...defaultPkgInfo,
      name: packageName || projectName,
      version: '1.0.0',
    }
    write('package.json', JSON.stringify(pkg, null, 2))

    spinner.succeed('Done. Now run:')
    if (root !== cwd) logger.success(`  cd ${path.relative(cwd, root)}`)
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent as any)
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
    switch (pkgManager) {
      case 'yarn':
        logger.success('  yarn')
        logger.success('  yarn dev')
        break
      case 'pnpm':
        logger.success('  pnpm')
        logger.success('  pnpm dev')
        break
      default:
        logger.success(`  ${pkgManager} install`)
        logger.success(`  ${pkgManager} run dev`)
        break
    }
    logger.success()
  })
} catch (cancelled: any) {
  logger.error(cancelled.message)
}
