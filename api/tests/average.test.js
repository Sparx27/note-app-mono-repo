const { average } = require('../utils/for_testing')

// Para agrupar, describir un contexto o situacion en comun que tienen todos los tests que voy a usar
// El .skip es para que no lo este ejecutando al realizar los test
describe.skip('average', () => {
  test('of one value is the itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  // Corner case
  test('of empty string is zero', () => {
    expect(average([])).toBe(0)
  })
})
