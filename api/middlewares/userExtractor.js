const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  // El web token se debe recuperar por la cabecera, no el body
  const authorization = request.get('authorization') // Es un metodo de express para recuperar la cabecera
  // Se utilizara el sistema Bearer, osea Bearer dsgdhgj465ghf...
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7) // El token comienza luego de 'bearer ' (7 espacios)
  }

  let decodedToken = {}
  decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) response.status(401).json({ error: 'token invalid or missing' })
  // Ahora se estaria controlando el que no se pueda crear una nota sin el token

  const { id: userId } = decodedToken

  request.userId = userId

  next()
}
