import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
// Routes
import { AuthRouter } from './routes/auth/route.js'
import { FoodRouter } from './routes/food/route.js'

dotenv.config({debug:true})

const app = express()


app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Routes 
app.use('/auth',AuthRouter)
app.use('/api',FoodRouter)

app.listen(3000,() => {
    console.log(`http://localhost:3000`)
})