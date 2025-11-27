import userRepo from "../repository/user.js";
import ApiError from "../utils/ApiError.js";

export const basicAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return next(
        ApiError.unauthorized("Missing or invalid Authorization header"),
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(ApiError.unauthorized("Invalid Basic token"));
    }

    let decoded;
    try {
      decoded = Buffer.from(token, "base64").toString("utf8");
    } catch (e) {
      return next(ApiError.unauthorized("Malformed Basic token"));
    }

    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex <= 0) {
      return next(ApiError.unauthorized("Invalid Basic credentials format"));
    }

    const userName = decoded.substring(0, separatorIndex);
    const password = decoded.substring(separatorIndex + 1);

    if (!userName || !password) {
      return next(ApiError.unauthorized("Username and password are required"));
    }

    const user = await userRepo.getUserbyUsername(userName);
    if (!user || user.password !== password) {
      return next(ApiError.unauthorized("Invalid Credentials"));
    }

    user.password = undefined;
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
