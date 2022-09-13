module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        "prettier",
        "prefer-arrow",
        "functional",
    ],
    'rules': {
        "no-var": "error",
        "prettier/prettier": ["warn"],
        "prefer-arrow/prefer-arrow-functions": "error",
        "functional/immutable-data": "error",
        "functional/no-let": "error",
        "functional/no-class": "error",
        "functional/no-mixed-type": "error",
        "functional/no-this-expression": "error",
        "functional/no-loop-statement": "error",
        "functional/no-promise-reject": "error",
        'no-unused-vars': [
            'warn',
            {
                args: "none",
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ]
    },
    'overrides': [
    ],
}
