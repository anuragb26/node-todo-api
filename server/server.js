require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyparser = require('body-parser')
const { ObjectID } = require('mongodb')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')
const { todos, users } = require('./tests/seed/seed')
const { authenticate } = require('./middleware/authenticate')
const app = express()
const port = process.env.PORT

app.use(bodyparser.json())

app.post('/todos',authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then(doc => { res.send(doc) }, err => { res.status(400).send(err) })
})

app.get('/todos',authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({
      todos
    })
  }, err => {
    res.status(400).send(err)
  })
})

app.get('/todos/:id',authenticate, (req, res) => {
  let id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if (!todo) {
      return res.status(404).send()
    }
    res.status(200).send({ todo })
  }, err => res.status(400).send(err))
})

app.delete('/todos/:id',authenticate, (req, res) => {
  let id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOneAndRemove({_id:id,_creator: req.user._id}).then(todo => {
    if (!todo) {
      return res.status(404).send()
    }
    res.status(200).send({ todo })
  }).catch(err => {
    console.log(err)
    return res.status(400).send(err)
  })

})

app.patch('/todos/:id',authenticate, (req, res) => {
  let id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  let body = _.pick(req.body, ['text', 'completed'])
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }
  Todo.findOneAndUpdate({_id: id,_creator: req.user._id}, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({ todo })
    })
    .catch(err => res.status(400).send(err))
})

app.post('/user', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken() // since user returned by promise is same as user = new User(body)
  }).then((token) => {
    return res.header('x-auth', token).send({ user })
  }).catch(e => res.status(400).send(e))
})

app.get('/users/me', authenticate, (req, res) => {
  return res.send(req.user)
})

app.post('/user/login',  async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password'])
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    return res.header('x-auth', token).send({ user })
  } catch (err) {
    return res.status(400).send(err)
  }
})



app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {
  app
}
