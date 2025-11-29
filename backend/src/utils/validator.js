import validator from 'validator';


const IsEmail = (data = '') => {
    return validator.isEmail(data)
}

export {IsEmail}