const jwt = require('jsonwebtoken')

let data = {
  id: 10
}

let token = jwt.sign(data, 'abc')
console.log(token)

let decoded = jwt.verify(token, 'abc')
console.log(decoded)