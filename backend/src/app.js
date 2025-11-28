import express, { urlencoded } from 'express'
import cors from 'cors'
import { AuthRouter } from './routes/auth/route.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const app = express()


app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// Routes 
app.use('/auth',AuthRouter)

app.listen(3000,() => {
    console.log(`http://localhost:3000`)
})