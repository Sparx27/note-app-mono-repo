const { app } = require('../index') // Se exporta del index.js (module.exports = app) y se importa aqui
const supertest = require('supertest')
const User = require('../models/User')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo full stack con el amigo midudev',
    important: true,
    date: new Date()
  },
  {
    content: 'Nota 2',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}
