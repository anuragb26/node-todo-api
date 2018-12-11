const { mongoose } = require('../db/mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid emamil'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

// below is how you define instance methods or override them

userSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  return _.pick(userObject, ['_id', 'email']) 
}
userSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString()
  user.tokens = user.tokens.concat([{ access, token }])
  return user.save().then((doc) => {
    return token
  })
}

// below is how you define model methods

userSchema.statics.findByToken = function (token) {
  let User = this
  let decoded = null;
  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    /*
    return new Promise((resolve, reject) => {
      reject()
    })
    */
    return Promise.reject() // equivalent to the above code
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}
let User = mongoose.model('user', userSchema)

module.exports = { User, userSchema }
