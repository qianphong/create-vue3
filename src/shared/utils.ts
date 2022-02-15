import fs from 'fs'
import path from 'path'

export function isEmpty(path: string) {
  return fs.readdirSync(path).length === 0
}

// export function isValidPkgName(projectName: string) {
//   return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
//     projectName,
//   )
// }

export function toValidPkgName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

export function rimraf(dir: string | string[]) {
  if (typeof dir === 'string') {
    emptyDir(dir)
    fs.rmdirSync(dir)
    return
  }
  if (Array.isArray(dir)) dir.forEach(item => rimraf(item))
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

export function writePkg(path: string, content: Record<string, any>) {
  const pkg = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))
  const newPkg = {
    ...pkg,
    ...content,
  }
  fs.writeFileSync(path, JSON.stringify(newPkg, null, 2), {
    encoding: 'utf-8',
  })
}
