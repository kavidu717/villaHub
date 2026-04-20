import express from 'express'
import { connectDB } from './src/config/db.js'
import authRouter from './src/routes/authRoute.js'
import bodyParser from 'body-parser'
import vilaRouter from './src/routes/vilaRoute.js'
import connectCloudinary from './src/config/cloudinary.js'





const app = express()
connectCloudinary()
connectDB()

app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('first testing api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/villa',vilaRouter)




app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
