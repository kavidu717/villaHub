import express from 'express'
import { connectDB } from './src/config/db.js'



const app = express()
connectDB()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
