import { configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken'

configDotenv()


const Token = (data) => {
    return jwt.sign(data,process.env.JWT_SECRET)
}


const Decode = (token = '') => {
    return jwt.decode(token,process.env.JWT_SECRET)
}

export {Token,Decode}

