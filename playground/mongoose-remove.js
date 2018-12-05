
const {ObjectID} = require('mongodb')
const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

/*

Todo.remove({ text: 'Complete course', completed: true }).then(result => {
  console.log(result)
})

*/

Todo.findOneAndRemove({ _id: '5c0818e41ba8e3a2a9cb85a7' }).then(todo => {
  console.log(todo)
})

Todo.findByIdAndRemove('5c0818e41ba8e3a2a9cb85a7').then(todo => {
  console.log(todo)
})
