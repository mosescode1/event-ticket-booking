import userRepo from "../repository/user.js";
import ApiError from "../utils/ApiError.js";

class AuthController {
  async register(req, res, next) {
    try {
      if (!req.body) {
        throw ApiError.badRequest("Missing request body");
      }
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw ApiError.badRequest("Missing username or password");
      }
      const role = "admin";
      const user = await userRepo.createUser(userName, password, role);
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
