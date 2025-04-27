import dbConn from "./db/db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;

dbConn()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
    process.exit(1);
  });