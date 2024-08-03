import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

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
            typescript({
                tsconfig: './tsconfig.json',
                clean: true,
                useTsconfigDeclarationDir: true,
            }),
        ]
    }
];
