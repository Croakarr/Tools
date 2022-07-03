import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

export default {
    input: 'src/entrypoint.js',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        resolve({ 'node-resolve': { isRequire: true } }),
        commonJS({
            include: 'node_modules/**'
        })
    ]
};