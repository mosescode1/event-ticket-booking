import userRepo from "../repository/user.js";

export const basicAuth = async (req, res, next) => {
  const reqBody = req.body;

  if (
    !req.headers.authorization &&
    req.headers.authorization.startWith("Basic")
  ) {
    return res.status(401).json({ message: "missing authorization header" });
  }

  const token = req.headers.authorization.split(" ")[1];

  const decoded = Buffer.from(token, "base64").toString("utf8");
  const [userName, password] = decoded.split(":");

  // check user credentials in db
  const user = await userRepo.getUserbyUsername(userName);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  user.password = undefined;
  req.user = user;
  next();
};
