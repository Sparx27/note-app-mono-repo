const uniqueValidator = require('mongoose-unique-validator') // Agrega la funcionalidad de que username no se pueda repetir
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true // Se debe agregar userSchema.plugin(uniqueValidator) para utilizar la funcionalidad
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note' // Mismo nombre que el modelo de Note.js
  }]
})

userSchema.plugin(uniqueValidator)

// Le especifico como hacer el toJSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v // No muta la base de datos, muta lo que se devuelve
    delete returnedObject.passwordHash // IMPORTANTISIMO QUE EL NO DEVUELVA EL PASSWORD
  }
})

const User = model('User', userSchema)

module.exports = User
