import typescript from 'rollup-plugin-typescript2';
import deletePlugin from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: './dist/index.min.mjs',
                format: 'esm',
            },
            {
                file: './dist/index.min.cjs',
                format: 'cjs',
            }
        ],
        preserveModules: true,
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                clean: true
            }),
            terser()
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/index.min.d.ts',
            format: 'es',
        },
        plugins: [
            dts(),
            deletePlugin({
                targets: ['dist/*', '!dist/index.min.cjs', '!dist/index.min.mjs', '!dist/index.min.d.ts'],
                hook: 'buildEnd',
                verbose: true
            })
        ]
    }
];
