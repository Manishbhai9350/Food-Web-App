import { FoodModel } from "../../model/food/model.js";
import { UserModel } from "../../model/user/model.js";

const GetLikedAndSavedReels = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Fetch full user to get liked and saved lists
    const dbUser = await UserModel.findById(user._id);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Fetch liked reels
    const likedReels = dbUser.liked && dbUser.liked.length > 0
      ? await FoodModel.find({ _id: { $in: dbUser.liked } })
      : [];

    // Fetch saved reels
    const savedReels = dbUser.saved && dbUser.saved.length > 0
      ? await FoodModel.find({ _id: { $in: dbUser.saved } })
      : [];

    return res.status(200).json({
      success: true,
      likedReels,
      savedReels
    });

  } catch (error) {
    console.log("GetLikedAndSavedReels error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export default {
    likedAndSaved:GetLikedAndSavedReels
}