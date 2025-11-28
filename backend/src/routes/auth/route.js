
import  { Router } from 'express';
import AuthController from '../../controllers/Auth/controller.js';

const AuthRouter =  Router()

AuthRouter.post('/user/register',AuthController.user.register)
AuthRouter.post('/user/login',AuthController.user.login)
AuthRouter.post('/user/logout',AuthController.user.logout)

AuthRouter.post('/foodpartner/register',AuthController.partner.register)
AuthRouter.post('/foodpartner/login',AuthController.partner.login)
AuthRouter.post('/foodpartner/logout',AuthController.partner.logout)





export {AuthRouter}