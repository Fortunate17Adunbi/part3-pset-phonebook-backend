require("dotenv").config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)
// app.use(morgan(':request'))
app.use(morgan(':method :url - :status :res[content-length] - :response-time ms :request'))

morgan.token("request", function(request, response) {
    return JSON.stringify(
        request.body
    )
})


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }

]




const generateId = () => {
    const maxId = persons.length > 0 ? 
    Math.max(...persons.map(person => Number(person.id))) :
    0

    return String(maxId + 1)
}

app.get("/", (request, response) => {
    response.send("<h1>Welcome to Phone book</h1>")
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    }).catch(error => {
        console.log(`Could not get numbers: ${error}`)
    })
})

app.get("/info", (request, response, next) => {
    // const phonebookList = persons.length
    // const date = new Date()
    // response.send(`
    //     <p>Phone book has info for ${phonebookList} people</p>
    //     <br />
    //     <p>${date}</p>
    // `)
    Person.find({}).then(person => {
        response.send(`
            <p>Phone book has info for ${person.length} people</p>
            <br />
            <p>${new Date()}</p>
        `)
    }).catch(error => next(error))
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findById(id).then(result => {
        response.json(result)
    }).catch(error => {
        console.log(`Could not get perons ${error.message}`)
    })
})

app.post("/api/persons/", (request, response) => {
    const body = request.body

    if ((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: "Missing name or number"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    Person.find({ name: person.name }).then(result => {
        if (result.length > 0) {
            console.log("name already exist")
            return response.status(401).json({
                error: "Name already exists"
            })   
        }

        person.save().then(result => {
            console.log(`Added ${person.name} number ${person.number} to phonebook`)
            response.json(result)
        }).catch(error => {
            console.log(`Could not add ${person.name}'s number to phonebook`)
        })
    })

})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedNumber => {
        response.json(updatedNumber)
    }).catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(deletedNumber => {
        response.json(deletedNumber)
        response.status(204).end()
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})