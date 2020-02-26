const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const analytics = require('./analytics')
const public = require('./public')

app.use(bodyParser.urlencoded({ extended: false, limit: Math.pow(2, 64) }))
app.use(bodyParser.json())

analytics(app)

app.use(express.static(public))

module.exports = app
