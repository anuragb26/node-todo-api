const { MongoClient, ObjectID } = require('mongodb')

// let obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Cannot connect to mongodb server')
  }
  console.log('Connected to Mongodb server')

  db.collection('Todos').find().count().then((count) => {
    console.log('Todos:', count)
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })

  db.collection('Users').find({ name: 'Anurag Bajaj' }).toArray().then(data => {
    console.log('data', data)
  }, err => console.log('error', err))

  //db.close()
})
