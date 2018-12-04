const {ObjectID} = require('mongodb')
const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

/*
let id = "5c06caeb7375b05018a1a10a"

if (!ObjectID.isValid(id)) {
  console.log('id not valid')
}

Todo.find({ _id: id }).then(todos => console.log('Todos', todos))

Todo.findOne({ completed: false }).then(todo => console.log('Todo', todo))

Todo.findById(id).then(todoById => {
  if (!todoById) {
    console.log('Id not found')
  }
  console.log('todoById', todoById)
}).catch((err) => {
  console.log('err', err)
})
*/

User.findById('5c0579ecfeebfe00261b2bd5').then(userById => {
  if (!userById) {
    console.log('Id not found')
  }
  console.log('userById', userById)
}).catch(err => {
  console.log('err', err)
})