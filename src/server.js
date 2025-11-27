import { app } from "./app.js";
import { config } from "./config/config.js";
import "reflect-metadata";

const PORT = config.PORT || 3000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
