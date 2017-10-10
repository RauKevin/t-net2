const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// add database require assignment
const mongo = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017/test'

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req, res) => {
  let item = {
    email: req.body.email,
    password: req.body.password
  }
  res.send({
    message: `Hello ${req.body.email}! Your user was registered! Have fun!`
  })

  mongo.connect(url, (err, db) => {
    assert.equal(null, err)
    db.collection('users').insertOne(item, (err, result) => {
      assert.equal(null, err)
      console.log('User added ', req.body.email, req.body.password)
      db.close()
    })
  })

  res.redirect('/') // this didnt work
})

app.get('/get-data', (req, res) => {
  var resultArray = []
  mongo.connect(url, (err, db) => {
    assert.equal(null, err)
    let cursor = db.collection('users').find()
    cursor.forEach(function (doc, err) {
      assert.equal(null, err)
      resultArray.push(doc)
    }, function () {
      db.close()
      res.render('index', {item: resultArray})
    })
  })
})

app.listen(process.env.PORT || 8081)
