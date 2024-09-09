const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
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

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:', request.path)
//     console.log('Body:', request.body)
//     console.log('---')
//     next()
// }
// app.use(requestLogger)

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
    console.log(persons)
    response.json(persons)
})

app.get("/info", (request, response) => {
    const phonebookList = persons.length
    const date = new Date()
    response.send(`
        <p>Phone book has info for ${phonebookList} people</p>
        <br />
        <p>${date}</p>
    `)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const note = persons.find(person => person.id === id)

    note ? response.json(note) : response.status(404).end()
})

app.post("/api/persons/", (request, response) => {
    const body = request.body

    if ((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: "Missing name or number"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    const nameExists = persons.filter(persons => persons.name === person.name)
    // console.log(nameExists)
    // console.log(persons)
    if (nameExists.length !== 0) {
        return response.status(401).json({
            error: "Name already exists"
        })
    }


    persons = persons.concat(person)
    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id

   const person = persons.find(person => person.id === id)
   persons = persons.filter(person => person.id !== id)
   response.json(person)
   response.status(204).end()
   console.log(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})