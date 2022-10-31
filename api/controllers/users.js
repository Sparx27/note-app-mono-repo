const bcrypt = require('bcrypt') // Agrego el hash para el password
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1, date: 1
  }) // El 'notes' viene de User.js
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request
    const { username, name, password } = body

    // Agrego la funcionalidad luego del test para evitar que un nombre de usuario se repita
    // Utilizo una libreria que trabaja con mongoose: npm install --save mongoose-unique-validator
    // Esta utilidad se agrega al Schema del User y asi no tener que hacer la misma validacion en varios sitios

    const passwordHash = await bcrypt.hash(password, 10) // Password y complejidad (salt rounds)
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    // Con un console.error(error) se podria ver como esta compuesto el error y luego manejarlo correctamente
    console.error(error)
    response.status(400).json({
      error
    })
  }
})

module.exports = usersRouter
