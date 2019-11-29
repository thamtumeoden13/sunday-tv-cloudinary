require('dotenv').config()
const express = require('express')
const cloudinary = require('cloudinary').v2
const formData = require('express-form-data')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')

const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use(cors({
  // origin: CLIENT_ORIGIN
  origin: true,
  methods: ["GET", "POST"],
  credentials: true,
  maxAge: 3600
}))

app.use(formData.parse())
app.get('/', (req, res) => res.send(JSON.stringify({ Hello: 'World' })))
app.get('/wake-up', (req, res) => res.send('👌'))
app.get('/hello', (req, res) => res.send('hello'))

app.get('/image-upload', (req, res) => {
  const values = Object.values(req.files)
  console.log("values", values)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))

  Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
})
console.log(process.env)
app.listen(process.env.PORT || 8080, () => console.log('👍'))