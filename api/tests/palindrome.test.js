// Se utilizara JEST para las pruebas
// npm install jest -D
/* },
"jest": {
  "testEnvironment": "node"
} */

/* Agrego al eslint que estoy utilizando jest para evitar correciones
"eslintConfig": {
  "extends": "./node_modules/standard/eslintrc.json",
  "env": {
    "jest": true
  }
},
"jest": { */

// Por ultimo, en scripts de packge.json: "test": "jest --verbose" (para usar npm run test)

const { palindrome } = require('../utils/for_testing')

test.skip('palindrome test', () => {
  const result = palindrome('termo')

  expect(result).toBe('omret')
})

// Test de corner cases
test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome() // Los metodos de palindrome no se pueden aplicar a un undefined, agrego este caso en la funcion palindrome.test.js

  expect(result).toBeUndefined() // https://jestjs.io/docs/expect para metodos
})
