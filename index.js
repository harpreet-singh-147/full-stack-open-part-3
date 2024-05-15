require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

app.use(cors());
app.use(express.static('dist'));

morgan.token('body', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(express.json());

app.use(
  morgan((tokens, req, res) => {
    return [
      `method:${tokens.method(req, res)} |`,
      `url:${tokens.url(req, res)} |`,
      `status:${tokens.status(req, res)} |`,
      `content-length:${tokens.res(req, res, 'content-length')} bytes |`,
      `response-time:${tokens['response-time'](req, res)} ms |`,
      req.method === 'POST' ? `http POST DATA:${tokens.body(req, res)}` : '',
    ].join(' ');
  })
);

const PORT = process.env.PORT;

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => res.json(people));
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id === +req.params.id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const newPersonData = req.body;

  if (!newPersonData.name && !newPersonData.number) {
    return res.status(400).json({ error: 'Name and number are required' });
  } else if (!newPersonData.name) {
    return res.status(400).json({ error: 'Name is required' });
  } else if (!newPersonData.number) {
    return res.status(400).json({ error: 'Number is required' });
  }

  const newPerson = new Person({
    name: newPersonData.name,
    number: newPersonData.number,
  });

  newPerson.save().then(person => res.json(person));
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id !== +req.params.id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
