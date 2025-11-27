import typeorm from "typeorm";
import { config } from "../config/config.js";
import UserSchema from "./entity/User.js";
import EventSchema from "./entity/Event.js";
import TicketSchema from "./entity/Ticket.js";
import WaitlistSchema from "./entity/Waitlist.js";

class Database {
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }

    this.dataSource = new typeorm.DataSource({
      type: "sqlite",
      database: config.DATABASE_NAME,
      entities: [UserSchema, EventSchema, TicketSchema, WaitlistSchema],
      synchronize: true,
    });

    this.dataSource.initialize();
    Database._instance = this;
  }

  getConnection() {
    return this.dataSource;
  }

  getInstance() {
    if (!Database._instance) {
      new Database();
    }
    return Database._instance;
  }
}
export default new Database();
