const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const { Todo } = require('../../models/todo')
const { User } = require('../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
      }
    ]
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    _creator: userTwoId,
    completedAt: 333
  }
]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save()
    let userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
  }).then(() => {
    done()
  })
}
const populateTodos = (done) =>{
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then((data) => {
    done()
  })
}

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}