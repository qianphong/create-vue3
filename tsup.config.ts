import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts'],
  clean: true,
  minify: true,
  format: ['esm'],
  splitting: true,
  skipNodeModulesBundle: true,
})
