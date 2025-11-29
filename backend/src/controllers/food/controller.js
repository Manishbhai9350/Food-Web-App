import { FoodModel } from '../../model/food/model.js';
import { UploadFile } from '../../services/storage.service.js'


const createFood = async (req,res) => {
    try {

        const foodPartner = req.foodpartner;
        const { name,description } = req.body
        const video = req.file;

        if(!name || !description) {
            throw new Error('Name and Description Must Be Provided')
        }

        if(!video) {
            throw new Error('No File Provided')
        }

        const uploaded = await UploadFile({
            file:video.buffer,
            fileName:video.originalname
        })

        const food = await FoodModel.create({
            name,
            description,
            video:uploaded.url,
            partner:foodPartner._id
        })

        return res.status(201).json({
            message:'Food Added Successfully',
            food,
            success:true
        })
    } catch (error) {

        console.log(error)

        return res.status(401).json({
            message:error.json,
            success:false
        })
        
    }
}


export default {
    food:{
        create:createFood
    }
}