const { MongoClient, ObjectID } = require('mongodb')

// let obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Cannot connect to mongodb server')
  }
  console.log('Connected to Mongodb server')

  //db.close()
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5c003848af7c503c594ee4c4')
  }, {
      $set: {
      completed: true
      },
      $currentDate : {
        'timestamp' : true
      }
    },
    {   
      returnOriginal : false
    }).then(data => console.log(data))
  
})
