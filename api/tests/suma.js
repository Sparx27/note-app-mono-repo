const suma = (a, b) => {
  return a - b
}

/* console.assert( // Si lo que pongo como primer parametros es false, te sale lo segundo
  suma(1, 3) === 4,
  'suma de 1 y 3 deberia ser 4'
) // Si la prueba pasa, en consola no se muestra nada

console.assert(
  suma(0, 0) === 0,
  'suma de 0 y 0 deberia dar 0'
) */

// Otra forma bastante comoda
const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 3, result: 4 },
  { a: -3, b: 3, result: 0 }
]

checks.forEach(check => {
  const { a, b, result } = check
  console.assert(
    suma(a, b) === result,
    `suma de ${a} y ${b} deberia ser ${result}`
  )
})

console.log(`${checks.length} pruebas realizadas...`)
