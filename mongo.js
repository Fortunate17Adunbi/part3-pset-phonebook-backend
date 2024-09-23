const mongoose = require('mongoose')

// if (process.argv.length == 3) {
//     // console.log("Hello")
//     // process.exit(1)
//     const password = process.argv[2]

//     const url = `mongodb+srv://fullstack:${password}@cluster0.pcimp.mongodb.net/phonebookApp/?retryWrites=true&w=majority`
//     mongoose.set('strictQuery',false)
//     mongoose.connect(url)

//     const personSchema = mongoose.Schema({
//         name: String,
//         number: String,
//     })

//     const Person = mongoose.model('Person', personSchema)
//     console.log(typeof(Person))
//     Person.find({}).then(result => {
//         console.log(result)
//         console.log("Phonebook:")
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//             mongoose.connection.close()
//             process.exit(1)
//         })
//     })
//     process.exit(1)
// }


if (process.argv.length === 3 || process.argv.length === 5) {
  const data = {
    password: process.argv[2],
    name: process.argv[3],
    number: process.argv[4],
  }

  const url = `mongodb+srv://fullstack:${data.password}@cluster0.pcimp.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  // console.log(data.password)
  // console.log(url)
  // process.exit(1)
  mongoose.set('strictQuery',false)
  mongoose.connect(url)

  const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', phonebookSchema)

  if (process.argv.length === 3) {
    Person.find({}).then(result => {
      console.log('Phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })

      mongoose.connection.close()
    })
  }
  else
  {
    const person = new Person({
      name: `${data.name}`,
      number: `${data.number}`,
    })

    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
  }
}
else if (process.argv.length !== 5) {
  console.log('usage: node mongo.js <yourPassword> <Name> <Number>')
  process.exit(1)
}