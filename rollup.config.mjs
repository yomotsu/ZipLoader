import pkg from './package.json' assert { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const license = `/*!
 * ${ pkg.name }
 * https://github.com/${ pkg.repository }
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 * ZipLoader uses pako, released under the MIT license.
 */`

export default {
	input: 'src/ZipLoader.js',
	output: [
		{
			format: 'umd',
			name: 'ZipLoader',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		nodeResolve( {
			jsnext: true,
			browser: true,
			preferBuiltins: false,
		} ),
		commonjs(),
	]
};
