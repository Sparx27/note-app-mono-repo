const mongoose = require('mongoose')
const { model, Schema } = mongoose

// Defino un ESQUEMA (contratro que tienen los documentos de una coleccion, estos deben tener estas propiedades)
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  // Esto para interrelacionar las notas con los usuarios
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v // No muta la base de datos, muta lo que se devuelve
  }
})

// Con el Schema se crea un MODELO (es que, utilizando este schema, crea una clase que va a permitir crear instancias de estas notas y grabarlas en la base de datos)
const Note = model('Note', noteSchema)

/*  Note.find({}).then(result => {
  console.log(result)
  mongoose.connection.close()
 }) */

/* const note = new Note({
  content: 'MongoDB es amazing!',
  date: new Date().toISOString(),
  important: false
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close() // Buena practica, es mejor agregarla
  })
  .catch(error => {
    console.log(error)
  })
*/

module.exports = Note
