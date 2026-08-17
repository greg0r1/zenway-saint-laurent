/* ============================================================
   ESLINT — garde-fou statique du JavaScript du projet
   Deux mondes séparés, avec des globales très différentes :
   les fonctions serverless de api/ (Node, CommonJS) et les
   scripts du site et de l'admin (navigateur, chargés en <script>
   classiques, donc à portée globale partagée).
   ============================================================ */
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', '.vercel/**', '.impeccable/**', 'assets/fonts/**', 'assets/img/**']
  },

  js.configs.recommended,

  /* ---- Fonctions serverless (api/) : Node, CommonJS ---- */
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { ...globals.node }
    },
    rules: {
      'no-console': 'off', // la sortie standard est le seul journal disponible
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  /* ---- Site public et admin : navigateur, scripts classiques ----
     Ces fichiers ne sont pas des modules : ils se voient les uns les
     autres par la portée globale. Les symboles qu'ils s'échangent sont
     déclarés ici, sinon no-undef les signalerait à tort. */
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        google: 'readonly', // Google Identity Services (page /admin)
        AdminAuth: 'writable',
        AdminModules: 'writable',
        AdminPanel: 'writable',
        AdminStore: 'writable',
        AdminTheme: 'writable',
        CONFIG_ADMIN: 'writable',
        CONFIG_HELLOASSO: 'writable',
        CONFIG_VIDEOS: 'writable'
      }
    },
    rules: {
      /* Ces symboles sont déclarés par leur propre fichier et consommés
         par les autres : c'est le mécanisme d'export du projet, pas une
         redéclaration accidentelle, et leur usage est invisible depuis
         le fichier qui les définit. */
      'no-redeclare': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^(CONFIG_|Admin)' }
      ],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  /* ---- Ce fichier de configuration lui-même : module ESM ---- */
  {
    files: ['eslint.config.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } }
  }
];
