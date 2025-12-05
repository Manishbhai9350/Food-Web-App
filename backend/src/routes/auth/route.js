
import  { Router } from 'express';
import AuthController, { IsAuthorized, Logout } from '../../controllers/Auth/controller.js';


const AuthRouter =  Router()

AuthRouter.post('/user/register',AuthController.user.register)
AuthRouter.post('/user/login',AuthController.user.login)

AuthRouter.post('/foodpartner/register',AuthController.partner.register)
AuthRouter.post('/foodpartner/login',AuthController.partner.login)

AuthRouter.post('/authorized',IsAuthorized)
AuthRouter.post('/logout',Logout)





export {AuthRouter}