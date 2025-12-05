import { Router } from "express";
import UserController from '../../controllers/user/controller.js'
import { AuthenticateUser } from "../../middleware/auth/index.js";



const UserRouter = Router()

UserRouter.get('/reels',AuthenticateUser,UserController.likedAndSaved)



export { UserRouter }