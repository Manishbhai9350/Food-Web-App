import { UserModel } from "../../model/user/model.js";
import { Hash } from "../../utils/bcrypt.js";
import { Decode, Token } from "../../utils/jwt.js";
import { IsEmail } from "../../utils/validator.js";

export const Register = async (req, res) => {
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

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
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

export const AuthController = {
  register: Register,
  login: Login
};
