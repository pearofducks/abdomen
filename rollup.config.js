export default {
  input: './index.mjs',
  output: {
    file: './cjs/index.cjs', format: 'cjs'
  },
  external: ['jsdom']
}
