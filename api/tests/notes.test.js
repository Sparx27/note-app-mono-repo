// Esto para cerrar la base de datos al final del test
const mongoose = require('mongoose')

const { server } = require('../index') // Se exporta del index.js (module.exports = app) y se importa aqui
const Note = require('../models/Note') // Me traigo el Schema y Model
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

// Antes de realizar el test, agrega a la base de datos esas dos notas
beforeEach(async () => {
  await Note.deleteMany({})

  // IMPORTANTE!! EN UN FOREACH NO VA A DAR RESULTADO HACER UN ASYNC DENTRO DEL LOOP
  // Esta es la forma mas rapida, pero las notas se crean todas a la vez, no hay seguridad de que mantengan su orden
  /* const notesObjects = initialNotes.map(note => new Note(note))
  const promises = notesObjects.map(note => note.save())
  await Promise.all(promises) */

  // Esta seria la forma correcta realmente, una a la vez y en orden, secuencial
  for (const note of initialNotes) {
    const notesObject = new Note(note)
    await notesObject.save()
  }
})

// EJECUTAR UN TEST EN CONCETRO: En consola: npm run test -- -t "test title, ex. Notes are returned as json"
// Se puede poner de title "Notes" y testea todos los que contengan Notes en su title

// TESTS SOBRE GET
test('Notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/) // Testea que el content type INCLUYA la regex
})

// Corroborar que me este devolviendo realmente notas
test(`There are ${initialNotes.length} notes`, async () => {
  const { response } = await getAllContentFromNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('The first note is about midudev', async () => {
  const { contents } = await getAllContentFromNotes()

  expect(contents).toContain('Aprendiendo full stack con el amigo midudev')
})

// Buscar content en todas las notas y ver si hace match
test('Note with expected content', async () => {
  const { contents } = await getAllContentFromNotes()

  expect(contents).toContain('Aprendiendo full stack con el amigo midudev')
})

// TESTS SOBRE POST
test('A valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-type', /application\/json/)

  // Corroboro que se creo en la base de datos
  const { contents, response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('Note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  // Corroboro que se creo en la base de datos
  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

// TEST SOBRE DELETE
test('A note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { response: secondResponse } = await getAllContentFromNotes()
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
})

test('A note that do not exist can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)

  const { response } = await getAllContentFromNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

// Esto es un hook
afterAll(() => {
  mongoose.connection.close()
  server.close()
})

// NOTA: Para saber asegurarse que los tests van en buen camino, se debe probar hacerlos fallar agrede primero, por ejemplo podria poner expect(400) sabiendo que en realidad debe ser un 200

// NOTA II: Para quitar los console log y otras cosas inecesarias de la consola al realizar los tests primero, en package.json: agrego al "test": "cross-env NODE_ENV=test jest --verbose" un --silent (quita los console.log)

// NOTA III: Para que se ejecuten los test al guardado de cambios en los ficheros, en package.json
// "test:watch": "npm run test -- --watch" (El primer -- es para que tome el codigo del valor anterior, osea el "cross-env NODE_ENV=test jest --verbose --silent" del "test")
// Luego de agregado, ejecuto npm run test:watch

// Manejo de ciertos errores esperables"
/*
Cannot log after tests are done. Did you forget to wait for something async in your test?
RESPUESTA: El metodo en api es asincrono, no se esta esperando a que termine la ejecucion del .get

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
RESPUESTA: Trata sobre algo que no se esta cerrando, una coneccion, evento, algo que se esta escuchando y no se esta cerrando. Agrego al package.json > "test" un --detectOpenHandles. El arreglo del puerto esta al final del index.js y al importe y use de server en este fichero.
En el caso con mongoose.connection.close es por la version, se deberia hacer un downgrade a la 5.11.15.
Una vez arreglo estos avisos, quitar el --detectOpenHandles

listen EADDRINUSE: adress already in use :::3001
RESPUESTA: en el package.json, en "test": "test": "cross-env NODE_ENV=test PORT=3002 jest --verbose"
Esto ejecuta el test en otro puerto y evita el conflicto
*/
