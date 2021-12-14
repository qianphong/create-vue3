import spawn from 'cross-spawn'

type Options = {
  shallow?: boolean
  args?: string[]
}

function buildCloneCommand(repo: string, targetPath: string, opts: Options) {
  const args: string[] = ['clone']
  const userArgs = opts.args || []

  if (opts.shallow) {
    if (userArgs.find(arg => arg.includes('--depth'))) {
      throw new Error(
        '\'--depth\' cannot be specified when shallow is set to \'true\'',
      )
    }
    args.push('--depth=1')
  }
  args.push(...userArgs)
  args.push(repo, targetPath)

  return args
}

/**
 * clone repo
 * @param repo 仓库地址
 * @param targetPath 目标
 * @param opts 选项
 */
export function cloneRepo(repo: string, directory: string, opts: Options) {
  const args = buildCloneCommand(repo, directory, opts)
  const proc = spawn.sync('git', args, { stdio: 'inherit' })
  if (proc.status !== 0) throw new Error(`\n\`git ${args.join(' ')}\` exited.`)
}
