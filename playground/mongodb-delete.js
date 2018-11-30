const { MongoClient, ObjectID } = require('mongodb')

// let obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Cannot connect to mongodb server')
  }
  console.log('Connected to Mongodb server')

  //db.close()
  /*
  db.collection('Todos').findOneAndDelete({ todo: 'Eat lunch' }).then(result => {
    console.log(result)
  })

  db.collection('Todos').deleteOne( { todo: 'Eat lunch'}).then(result => {
    console.log(result)
  })
  */

  db.collection('Todos').deleteMany( { todo: 'Eat lunch' }).then(result => {
    console.log(result)
  })
})
