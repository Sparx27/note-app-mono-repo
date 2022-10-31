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

module.exports.palindrome = (string) => {
  // Caso undefined
  if (typeof string === 'undefined') return undefined
  // Caso con strings
  return string.split('').reverse().join('')
}

module.exports.average = (array) => {
  let suma = 0
  // Corner case de array vacio
  if (array.length === 0) return 0

  array.forEach(num => { suma += num })
  return suma / array.length
}
