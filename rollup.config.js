import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: './src/index.ts',
        output: {
            file: './dist/index.mjs',
            format: 'esm',
        },
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            terser()
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/index.cjs',
            format: 'cjs',
        },
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            terser()
        ]
    }
];
