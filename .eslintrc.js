// /** @type {import("eslint").Linter.Config} */
// module.exports = {
//     root: true,
//     extends: [
//       'next',
//       'next/core-web-vitals',
//       'eslint:recommended',
//       'plugin:react/recommended',
//       'plugin:react-hooks/recommended',
//       'plugin:import/errors',
//       'plugin:import/warnings',
      
//       'plugin:jsx-a11y/recommended',
//       'plugin:prettier/recommended', // integrasi prettier
//     ],
//     plugins: ['unused-imports'],
//     rules: {
//       // Umum
//       'import/no-unresolved': 'error', // ⬅️ RULE INI YANG KAMU BUTUHKAN
//       'react/prop-types': 'off',
//       'react/display-name': 'off',
//       'react/no-unescaped-entities': 'off',
//       'no-console': 'warn',
//       'no-debugger': 'warn',
//       'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//       'unused-imports/no-unused-imports': 'warn',
//       'unused-imports/no-unused-vars': [
//         'warn',
//         { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
//       ],
  
//       // React khusus
//       'react/react-in-jsx-scope': 'off', // Next.js tidak butuh import React
//       'react/jsx-uses-react': 'off',
  
//       // Import order (optional)
//       'import/order': [
//         'warn',
//         {
//           groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
//           'newlines-between': 'always',
//         },
//       ],
//     },
//     settings: {
//       'import/resolver': {
//         typescript: {}, // ⬅️ Gunakan resolver typescript agar path dari jsconfig/tsconfig dikenali

//         node: {
//           extensions: ['.js', '.jsx', '.ts', '.tsx'],
//         },
//       },
//     }
    
//   }
  