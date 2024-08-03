import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import deletePlugin from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.mjs',
                format: 'esm',
            },
            {
                file: './lib/index.cjs',
                format: 'cjs',
            }
        ],
        preserveModules: true,
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                clean: true,
            }),
            terser(),
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: './lib/index.d.ts',
            format: 'es',
        },
        plugins: [
            dts(),
            deletePlugin({
                targets: ['lib/*', '!lib/index.d.ts', '!lib/index.cjs', '!lib/index.mjs'],
                hook: 'buildEnd',
                verbose: true
            })
        ]
    }
];
