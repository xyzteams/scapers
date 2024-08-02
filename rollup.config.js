import typescript from 'rollup-plugin-typescript2';
import deletePlugin from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.min.mjs',
                format: 'esm',
            },
            {
                file: './lib/index.min.cjs',
                format: 'cjs',
            }
        ],
        preserveModules: true,
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                clean: true,
            }),
            terser()
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: './lib/index.min.d.ts',
            format: 'es',
        },
        plugins: [
            dts(),
            deletePlugin({
                targets: ['lib/*', '!lib/index.min.cjs', '!lib/index.min.mjs', '!lib/index.min.d.ts'],
                hook: 'buildEnd',
                verbose: true
            })
        ]
    }
];
