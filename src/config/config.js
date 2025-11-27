import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

class Config {
  DATABASE_NAME = process.env.DATABASE_NAME || "event.sql";
  PORT = process.env.PORT || 3000;
}

const config = new Config();
export { config };
