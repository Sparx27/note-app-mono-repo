// Para hacer tests del backend se utiliza supertest (npm install supertest -D)

require('dotenv').config()
require('./mongodb')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const handleError = require('./middlewares/handleError')
const userExtractor = require('./middlewares/userExtractor')
const notFound = require('./middlewares/notFound')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/User')

app.use(cors())
app.use(express.json()) // Necesario para parsear a json el POST

app.use(express.static('../app/build'))

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({}).populate('user', { // El user viene de la propiedad en Note.js
    username: 1,
    name: 1
  })
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
    // console.log(error)
    // response.status(400).end()
  })
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }) // El new:true es para que muestre el objeto actualizado
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(next)
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  const { userId } = request

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id // Aun no se ha transformado a un toJSON
  })

  /* newNote.save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error)) */

  // Otra opcion sin el .catch async (request, response)...
  /*
  const savedNote = await newNote.save()
  response.json(savedNote)
  */

  // Si quisiera conservar el .catch async (request, response, next)...
  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

// Raices de rutas para manejo de usuarios
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Buena practica en caso de no haber encontrado nada
app.use(notFound)

// PARA MANEJAR ERRORES, POR EJEMPLO UNA RUTA QUE NO ENCUENTRE
app.use(handleError)

// El orden de los middlewares es importante al igual que de los paths, va de arriba a abajo

const PORT = process.env.PORT || 3001 // Si hago PORT 3003 run dev lo habre en localhost:3003
// const server = ... para solucionar el tema del notes.test.js
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
