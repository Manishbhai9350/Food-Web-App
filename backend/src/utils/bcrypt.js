import bcrypt from 'bcrypt'

const Hash = async (data) => {
    const hashed = await bcrypt.hash(data,12)
    return hashed
}
const Verify = async (data,hashed) => {
    const isVerified = await bcrypt.compare(data,hashed)
    return isVerified
}

export {Hash,Verify}