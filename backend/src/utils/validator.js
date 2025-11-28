import validator from 'validator';


const IsEmail = (data = '') => {
    return validator.isEmail(validator)
}

export {IsEmail}