const mongoose = require("mongoose")
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(result => {
        console.log("Connected to mongodb")
    })
    .catch(error => {
        console.log(`Error connecting to mongodb: ${error.message}`)
    })

const phonebookSchema = new mongoose.Schema({
    name: {
        minLength: 3,
        type: String,
    },
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)