const ERROR_HANDLERS = {
  CastError: response =>
    response.status(400).send({ error: 'id use is malformed' }),

  ValidationError: (response, { message }) =>
    response.status(409).send({ error: message }),

  JsonWebTokenError: response =>
    response.status(401).json({ error: 'token invalid or missing' }),

  TokenExpirerError: response =>
    response.status(401).json({ error: 'token expired' }),

  DefaultError: response =>
    response.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.error(error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.DefaultError
  handler(response, error)
}
