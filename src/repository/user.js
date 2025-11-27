import database from "../database/db.js";

class UserRepository {
  constructor() {
    this.database = database.getConnection().getRepository("user");
  }
  async createUser(userName, password, role) {
    const user = await this.database.save({ userName, password, role });

    user.password = undefined;
    return user;
  }

  async getUserbyUsername(userName) {
    return await this.database.findOneBy({ userName });
  }
}

export default new UserRepository();
