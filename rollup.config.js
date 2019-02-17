import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import babel       from 'rollup-plugin-babel';
import pkg         from './package.json';

const license = `/*!
 * ZipLoader
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 * 
 * ZipLoader uses the library pako released under the MIT license :
 * https://github.com/nodeca/pako/blob/master/LICENSE
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
	sourceMap: false,
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
		babel( { exclude: 'node_modules/**' } )
	]
};
