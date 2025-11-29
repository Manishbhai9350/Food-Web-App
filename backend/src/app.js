import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

// Routes
import { AuthRouter } from './routes/auth/route.js'
import { FoodRouter } from './routes/food/route.js'
import { Connect } from './db/mongo.database.js'

dotenv.config({debug:true})
Connect()

const app = express()

app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

// Routes 
app.use('/auth',AuthRouter)
app.use('/api',FoodRouter)

app.listen(3000,() => {
    console.log(`http://localhost:3000`)
})