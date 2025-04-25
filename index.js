require('dotenv').config()
const express = require('express')
const { handleError } = require('./middleware')
const Userrouter = require('./src/Routes/UserRoutes')
const bodyParser = require('body-parser')
const docRouter = require('./src/Routes/docRoute')
const dbConnect = require('./src/db')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())

dbConnect().catch(err => console.log(err))

app.use('/auth', Userrouter);
app.use('/docs', docRouter);
  
  app.use(handleError);
  app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`)
  })