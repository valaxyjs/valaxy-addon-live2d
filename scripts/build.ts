import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import consola from 'consola'
import pkg from '../package.json'

const sourceDir = path.resolve(process.cwd())
const distDir = path.resolve(process.cwd(), 'dist')
const excludeDirs = ['app', 'helpers', 'tsconfig.json', '.gitignore', 'dist', 'node_modules']

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  }
  else {
    return pkg.version
  }
}

const version = getVersion()

function copyFiles(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item)
    const destPath = path.join(dest, item)

    const relativePath = path.relative(sourceDir, srcPath)
    if (excludeDirs.some(excludeDir => relativePath.startsWith(excludeDir)))
      return

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath)
    }
    else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

function main() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true })
    consola.info(`Removed existing dist directory: ${distDir}`)
  }
  fs.mkdirSync(distDir)
  consola.info(`Created new dist directory: ${distDir}`)

  copyFiles(sourceDir, distDir)
}

exec('tsc', (error, _stdout, stderr) => {
  if (error) {
    consola.error(`exec error: ${error}`)
    return
  }
  if (stderr) {
    consola.warn(`exec stderr: ${stderr}`)
  }
  consola.success(`Build completed, version: ${version}\n`)
})

main()
