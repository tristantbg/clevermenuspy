import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const source = {
    input: 'src/MenuSpy',
    output: {
        file: 'dist/menuspy.js',
        format: 'umd',
        name: 'MenuSpy'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        })
    ]
};

const minified = {
    input: 'src/MenuSpy',
    output: {
        file: 'dist/menuspy.min.js',
        format: 'umd',
        name: 'MenuSpy'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify()
    ]
};

export  default [source, minified];
