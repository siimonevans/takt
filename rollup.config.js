/* global process */

import babel from 'rollup-plugin-babel'; // babel transpiles ES6 to ordinary javascript
import resolve from 'rollup-plugin-node-resolve'; // resolve and commonjs add support for importing node modules
import commonjs from 'rollup-plugin-commonjs'; // uses UglifyJS2, and works with transpiled code only: https://github.com/TrySound/rollup-plugin-uglify#warning
import uglify from 'rollup-plugin-uglify'; // plugins to display the original size of each import, and the final size of the bundle
import sizes from 'rollup-plugin-sizes';
import filesize from 'rollup-plugin-filesize';

// Create default config object
let config = {
    entry       : `${process.env.npm_package_config_src_js}/${process.env.entry}`,
    dest        : `${process.env.npm_package_config_dest_js}/${process.env.entry}`,
    format      : 'umd',
    globals     : {}, // specify globals in .eslintrc to ignore linting errors
    plugins     : [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel(),
    ]
};

// Add Production or Development settings to the config object
if(process.env.production){
    config.sourceMap = false;
    config.plugins.push(uglify());
    config.plugins.push(sizes());
    config.plugins.push(filesize());
} else {
    config.sourceMap = true;
}

export default config;
