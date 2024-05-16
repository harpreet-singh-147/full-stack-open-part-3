require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

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

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => res.json(people))
    .catch(e => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  const newPerson = new Person({
    name,
    number,
  });

  newPerson
    .save()
    .then(person => res.json(person))
    .catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then(person => res.json(person))
    .catch(e => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => next(e));
});

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(people =>
      res.send(
        `<p>Phonebook has info for ${
          people.length
        } people</p><p>${new Date()}</p>`
      )
    )
    .catch(e => next(e));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (e, req, res, next) => {
  if (e.name === 'CastError') {
    return res.status(400).send({ e: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  }

  next(e);
};

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
