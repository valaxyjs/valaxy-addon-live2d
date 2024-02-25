import path from 'node:path'
import process from 'node:process'
import { defineValaxyAddon } from 'valaxy'
import fs from 'fs-extra'
import consola from 'consola'
import pkg from '../package.json'

import type { Live2dOptions } from '../types'

export const addonLive2d = defineValaxyAddon<Live2dOptions>(options => ({
  name: pkg.name,
  enable: true,
  global: options?.global ?? false,
  options,

  setup(valaxy) {
    valaxy.hook('build:before', async () => {
      const srcDir = path.resolve(__dirname, '../assets')
      const destDir = path.resolve(process.cwd(), './public/live2d')

      try {
        await fs.ensureDir(destDir)
        consola.info('destDir', destDir)
        await fs.copy(srcDir, destDir)
        consola.info('Assets have been copied to the public folder.')
      }
      catch (err) {
        consola.error('Error copying assets to the public folder:', err)
      }

      // TODO: This will result in the loss of deployment files
      // try {
      //   const gitignorePath = path.join(destDir, '.gitignore')
      //   await fs.writeFile(gitignorePath, '*')
      //   consola.info('.gitignore file has been created in the public/live2d folder.')
      // }
      // catch (err) {
      //   consola.error('Error creating .gitignore file:', err)
      // }
    })
  },
}))
