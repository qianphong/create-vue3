import fs from 'fs'
import path from 'path'

// Taken from https://github.com/sindresorhus/slash/blob/main/index.js (MIT)
export function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path)
  if (isExtendedLengthPath || hasNonAscii) return path
  return path.replace(/\\/g, '/')
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) copyDir(src, dest)
  else fs.copyFileSync(src, dest)
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

export function isEmpty(path: string) {
  return fs.readdirSync(path).length === 0
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

export function createWriteFn(root: string, templateDir: string, { renameFiles }: {renameFiles?: Record<string, string>}) {
  return function write(file: string, content?: string) {
    const targetPath = renameFiles?.[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
    if (content) fs.writeFileSync(targetPath, content, { encoding: 'utf-8' })
    else copy(path.join(templateDir, file), targetPath)
  }
}

/**
* @param {string | undefined} userAgent process.env.npm_config_user_agent
* @returns object | undefined
*/
export function pkgFromUserAgent(userAgent: string) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}
