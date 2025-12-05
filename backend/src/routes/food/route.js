import  { Router } from 'express';
import { AuthenticateFoodPartner, AuthenticateUser } from '../../middleware/auth/index.js';
import FoodController from '../../controllers/food/controller.js'
import { MulterStorage } from '../../utils/multer.js'


const FoodRouter =  Router()


FoodRouter.post('/create',AuthenticateFoodPartner,MulterStorage.single('video'),FoodController.food.create)
FoodRouter.post('/reels',AuthenticateUser,FoodController.food.getAll)
FoodRouter.patch('/like',AuthenticateUser,FoodController.food.like)
FoodRouter.patch('/save',AuthenticateUser,FoodController.food.save)





export { FoodRouter }


