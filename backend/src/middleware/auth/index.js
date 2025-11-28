import { FoodPartnerModel } from "../../model/food-partner/model.js"
import { Decode } from "../../utils/jwt.js"

const AuthenticateFoodPartner = async (req,res,next) => {
  try {

    const token = req.cookies['token']

    const decoded = Decode(token) 

    const foodpartner = await FoodPartnerModel.findById(decoded.id)

    if(!foodpartner) {
      return res.status(400).json({
        message:'Please Login First',
        success:false
      })
    }

    req.foodpartner = foodpartner;

    next()

  } catch (error) {
    if(error) {
      return res.status(400).json({
        message:'Please Login First',
        success:false
      })
    }
  }
}


export {
    AuthenticateFoodPartner
}