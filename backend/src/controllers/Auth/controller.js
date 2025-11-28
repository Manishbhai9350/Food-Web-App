import { UserModel } from "../../model/user/model.js";
import { FoodPartnerModel } from "../../model/food-partner/model.js"
import { Hash } from "../../utils/bcrypt.js";
import { Decode, Token } from "../../utils/jwt.js";
import { IsEmail } from "../../utils/validator.js";

const Register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password || !IsEmail(email)) {
      return res.status(400).json({
        message: "!Please Provide Full Data",
        success: false,
      });
    }

    const ExistingUser = await UserModel.findOne({ email });

    if (ExistingUser) {
      return res.status(400).json({
        message: "!User Already Exist",
        success: false,
      });
    }

    const HashedPassword = Hash(password);

    const User = await UserModel.create({
      fullname,
      email,
      password: HashedPassword,
    });

    const JWT_TOKEN = Token({
      id: User._id,
      email,
      fullname,
    });

    return res.cookie("token", JWT_TOKEN).status(201).message({
      message: "User Registeration Successfull",
      success: true,
    });
  } catch (error) {}
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !IsEmail(email)) {
      return res.status(400).json({
        message: "!Please Provide Full Data",
        success: false,
      });
    }

    const User = await UserModel.findOne({ email });

    if (!User) {
      return res.status(400).json({
        message: "!User Does Not Exist",
        success: false,
      });
    }

    const IsPasswordMatch = Decode(password, User.password);

    if (!IsPasswordMatch) {
      return res.cookie("token", "").status(400).message({
        message: "Invalid Email Or Password",
        success: false,
      });
    }

    const JWT_TOKEN = Token({
      id: User._id,
      email,
      fullname,
    });

    return res.cookie("token", JWT_TOKEN).status(201).message({
      message: "User Logged In Successfull",
      success: true,
    });
  } catch (error) {}
};

const Logout = async (req,res) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({
            message:"Logout Successfull",
            success:true
        })
    } catch (error) {
        
    }
}
const FoodPartnerRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password || !IsEmail(email)) {
      return res.status(400).json({
        message: "!Please Provide Full Data",
        success: false,
      });
    }

    const ExistingUser = await FoodPartnerModel.findOne({ email });

    if (ExistingUser) {
      return res.status(400).json({
        message: "!User Already Exist",
        success: false,
      });
    }

    const HashedPassword = Hash(password);

    const User = await FoodPartnerModel.create({
      fullname,
      email,
      password: HashedPassword,
    });

    const JWT_TOKEN = Token({
      id: User._id,
      email,
      fullname,
    });

    return res.cookie("token", JWT_TOKEN).status(201).message({
      message: "User Registeration Successfull",
      success: true,
    });
  } catch (error) {}
};

const FoodPartnerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !IsEmail(email)) {
      return res.status(400).json({
        message: "!Please Provide Full Data",
        success: false,
      });
    }

    const User = await FoodPartnerModel.findOne({ email });

    if (!User) {
      return res.status(400).json({
        message: "!User Does Not Exist",
        success: false,
      });
    }

    const IsPasswordMatch = Decode(password, User.password);

    if (!IsPasswordMatch) {
      return res.cookie("token", "").status(400).message({
        message: "Invalid Email Or Password",
        success: false,
      });
    }

    const JWT_TOKEN = Token({
      id: User._id,
      email,
      fullname,
    });

    return res.cookie("token", JWT_TOKEN).status(201).message({
      message: "User Logged In Successfull",
      success: true,
    });
  } catch (error) {}
};

const FoodPartnerLogout = async (req,res) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({
            message:"Logout Successfull",
            success:true
        })
    } catch (error) {
        
    }
}



export default {
  user:{
    register: Register,
    login: Login,
    logout: Logout,
},
partner: {
      register: FoodPartnerRegister,
      login: FoodPartnerLogin,
      logout: FoodPartnerLogout,
  }
};
