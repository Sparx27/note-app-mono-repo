// Para utilizar los json web tokens
const jwt = require('jsonwebtoken')

// El codigo trata de los web tokens para registros y accesos a usuarios mas seguros
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash) // Checkea que el password sea correcto

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: 'Invalid user or password'
    })
  }

  // Una vez se corrobora que el usuario existe lo guardo en el token
  const userForToken = {
    id: user._id,
    username: user.username
  }

  // Ahora se firma el token
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  response.send({
    name: user.name,
    username: user.username,
    token // Devuelvo el token
  })
})

module.exports = loginRouter
