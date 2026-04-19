import express from 'express'
import { connectDB } from './src/config/db.js'
import authRouter from './src/routes/authRoute.js'
import bodyParser from 'body-parser'




const app = express()
connectDB()
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('first testing api')
})

app.use('/api/v1/auth', authRouter)



app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
