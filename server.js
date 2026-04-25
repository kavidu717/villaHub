import express from 'express'
import { connectDB } from './src/config/db.js'
import authRouter from './src/routes/authRoute.js'
import bodyParser from 'body-parser'
import vilaRouter from './src/routes/vilaRoute.js'
import connectCloudinary from './src/config/cloudinary.js'
import bookingRouter from './src/routes/bookingRoute.js'
import cors from 'cors'
import paymentRouter from './src/routes/paymentRoute.js'
import dotenv from 'dotenv'

dotenv.config()






const PORT = process.env.PORT || 3000

const app = express()
connectCloudinary()
connectDB()

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.send('first testing api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/villa',vilaRouter)
app.use('/api/v1/booking',bookingRouter)
app.use('/api/v1/payment', paymentRouter)







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
