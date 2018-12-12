const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo')
const { User } = require('../models/user')
const { todos, users, populateTodos, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text'
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find({ text }).then(todos => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch(err => {
          done(err)
        })
      })
  })
  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then(todos => {
          expect(todos.length).toBe(2)
          done()
        }).catch(err => {
          done(err)
        })
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2)) // will not get error callback
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.body.todos.length).toBe(2)
        done()
      })
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let id = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(id).then(todo => {
          expect(todo).toBeFalsy()
          done()
        }).catch(err => done(err))
      })

  })
  
  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 if object id invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done)
  })
  
})


describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    let id = todos[0]._id.toHexString()
    let text = 'change text via test'
    request(app)
      .patch(`/todos/${id}`)
      .send({ text: text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done)
  })
  it('should clear completed at when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString()
    let text = 'changing completed'
    request(app)
      .patch(`/todos/${id}`)
      .send({ text: text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.completedAt).toBeFalsy()
      })
      .end(done)
  })
})

describe('GET /users/me ', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if user not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /user/', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com'
    let password = 'example123'
    request(app)
      .post('/user')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
        expect(res.body.user._id).toBeTruthy()
        expect(res.body.user.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }
        User.findOne({ email: email }).then(user => {
          console.log(user.password)
          expect(user).toBeTruthy()
          expect(user.password).toNotBe(password)
          done()
        }).catch(err => done(err))
      })

  })
  it('should return validation errors if request data invalid', (done) => {
    let email = 'ab'
    let password = '123'
    request(app)
      .post('/user')
      .send({ email, password })
      .expect(400)
      .end(done)
  })
  it('should not create user if email already in use', (done) => {
    let email = 'andrew@example.com'
    let password = 'abcdef'
    request(app)
      .post('/user')
      .send({ email, password })
      .expect(400)
      .end(done)
  })
})