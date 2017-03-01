import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs'
import babel       from 'rollup-plugin-babel'

export default {
  entry: 'src/ZipLoader.js',
  indent: '\t',
  sourceMap: true,
  plugins: [
    nodeResolve( {
      jsnext: true,
      browser: true,
      preferBuiltins: false
    } ),
    commonjs( {
      include: [ 'node_modules/**' ],
      exclude: [],
      sourceMap: true,
    } ),
    babel( {
      exclude: 'node_modules/**',
      presets: [
        [ 'env', {
          targets: {
            browsers: [
              'last 2 versions',
              'ie >= 11'
            ]
          },
          loose: true,
          modules: false
        } ]
      ]
    } )
  ],
  targets: [
    {
      format: 'umd',
      moduleName: 'ZipLoader',
      dest: 'dist/ZipLoader.js'
    },
    {
      format: 'es',
      dest: 'dist/ZipLoader.module.js'
    }
  ]
};
