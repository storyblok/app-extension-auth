import dotenv from 'dotenv'

dotenv.config({path: '.env.test'});

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // testEnvironment: 'jsdom',
    "moduleNameMapper": {
        "^@src(.*)$": "<rootDir>/src$1"
    },
    testRegex: 'src/.*\\.test\\.(js|jsx|ts|tsx)$'
}