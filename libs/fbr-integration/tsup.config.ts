import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['axios', 'qrcode'],
  treeshake: true,
  onSuccess: async () => {
    console.log('✅ FBR Integration package built successfully')
  }
})