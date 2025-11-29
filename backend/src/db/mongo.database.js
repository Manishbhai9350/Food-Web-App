import mongoose from "mongoose"



export const Connect = async (n = 0) => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('Successfully connected to Mongo DB Database')
    } catch (error) {
        console.log('Error While Connecting To Database')
        console.log('Reconnecting In 3 seconds....')
        setTimeout(() => {
            if(n >= 3) {
                console.log('Maximum Attempt Reached ' + n)
            } else {
                console.log('Reconnecting..... Attempt ' + n)
                Connect(++n)
            }
        }, 3000);
    }
}