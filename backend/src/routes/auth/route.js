
import  { Router } from 'express';
import { AuthController } from '../../controllers/Auth/controller.js';

const AuthRouter =  Router()

AuthRouter.post('/register',AuthController.register)




export {AuthRouter}