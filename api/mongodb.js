const mongoose = require('mongoose')

// PARA AGREGAR LOS TESTS, SE VA A EXTRAER TAMBIEN LA CONNECTION STRING PARA TEST
// NO SE DEBE USAR LA MISMA BASE DE DATOS PARA LOS TESTS
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

// RECORDAR: Para crear los entornos de ejecucion primero npm isntall cross-env
// Luego, agregar en el .env y package.json lo correspondiente para que esto funcione

const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// Coneccion a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(error => {
    console.log(error)
  })
