const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URL

mongoose.connect(url)
  .then(() => {
    console.log('Connected to mongodb')
  })
  .catch(error => {
    console.log(`Error connecting to mongodb: ${error.message}`)
  })

const phoneRegExp = /^(\d{2}|\d{3})-(\d{6,})$/
const phonebookSchema = new mongoose.Schema({
  name: {
    minLength: 3,
    type: String,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return phoneRegExp.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', phonebookSchema)