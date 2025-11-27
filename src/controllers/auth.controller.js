import userRepo from "../repository/user.js";

class AuthController {
  async register(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Missing request body" });
      }
      const { userName, password } = req.body;
      if (!userName || !password) {
        return res
          .status(400)
          .json({ message: "Missing username or password" });
      }
      const role = "admin";
      const user = await userRepo.createUser(userName, password, role);
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new AuthController();
