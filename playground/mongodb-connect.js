const { MongoClient, ObjectID } = require('mongodb')

// let obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Cannot connect to mongodb server')
  }
  console.log('Connected to Mongodb server')

  /*
  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err)
    }
    console.log(JSON.stringify(result, undefined, 2))
  })
  */

  db.collection('Users').insertOne({
    name: 'Anurag Bajaj',
    age: 27,
    location: 'Pune'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err)
    }
    console.log(result.ops[0]._id.getTimestamp())
  })

  db.close()
})