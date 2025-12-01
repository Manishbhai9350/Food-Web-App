import { FoodModel } from "../../model/food/model.js";
import { UserModel } from "../../model/user/model.js";
import { UploadFile } from "../../services/storage.service.js";
import { Decode } from "../../utils/jwt.js";

const createFood = async (req, res) => {
  try {
    const foodPartner = req.foodpartner;
    const { title, description } = req.body;
    const video = req.file;

    if (!title || !description) {
      throw new Error("Title and Description Must Be Provided");
    }

    if (!video) {
      throw new Error("No File Provided");
    }

    const uploaded = await UploadFile({
      file: video.buffer,
      fileName: video.originalname,
    });

    const food = await FoodModel.create({
      title,
      description,
      video: uploaded.url,
      partner: foodPartner._id,
    });

    return res.status(201).json({
      message: "Food Added Successfully",
      food,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};
const likeFood = async (req, res) => {
  try {
    const token = req.cookies.token;
    const reelId = req.body.reel;

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = Decode(token);
    if (!decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "User unauthorized" });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const foodReel = await FoodModel.findById(reelId);
    if (!foodReel) {
      return res
        .status(404)
        .json({ success: false, message: "Food reel not found" });
    }

    // Toggle Like (Better UX)
    const alreadyLiked = foodReel.likes.includes(user._id);

    if (alreadyLiked) {
      foodReel.likes.pull(user._id);
      await foodReel.save();
      return res.json({
        success: true,
        message: "Unliked successfully",
        liked: false,
      });
    }

    foodReel.likes.push(user._id);
    await foodReel.save();

    return res.json({
      success: true,
      message: "Liked successfully",
      liked: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const GetReels = async (req, res) => {
  try {
    const currentReel = req.body?.current; // current Reel ID
    const direction = req.body?.direction; // "next" or "prev"
    const threshold = req.body?.threshold;

    let query = {};
    let sort = {};

    if (currentReel && direction && threshold) {
      // Fetch current reel to compare ordering
      const currentDoc = await FoodModel.findById(currentReel);
      if (!currentDoc) {
        return res.status(404).json({ message: "Current reel not found" });
      }

      if (direction === "next") {
        query = { _id: { $gt: currentDoc._id } };
        sort = { _id: 1 }; // oldest upcoming first
      } else if (direction === "prev") {
        query = { _id: { $lt: currentDoc._id } };
        sort = { _id: -1 }; // newest previous first
      } else {
        return res.status(400).json({ message: "Invalid direction" });
      }

      const reels = await FoodModel.find(query).sort(sort).limit(threshold);

      return res.json({
        success: true,
        direction,
        reels,
        hasMore: reels.length === threshold,
      });
    } else {
      // First load (no current ID provided)
      const reels = await FoodModel.find()
        .sort({ _id: -1 }) // newest first
        .limit(5);

        console.log(reels)

      return res.json({
        success: true,
        direction: "initial",
        reels,
        hasMore: reels.length === 5,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export default {
  food: {
    create: createFood,
    like: likeFood,
    getAll: GetReels,
  },
};
