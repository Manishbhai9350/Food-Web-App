import  { Router } from 'express';
import { AuthenticateFoodPartner } from '../../middleware/auth/index.js';
import FoodController from '../../controllers/food/controller.js'


const FoodRouter =  Router()


FoodRouter.post('/food/create',AuthenticateFoodPartner,FoodController.food.create)


export { FoodRouter }


