const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const { validateJWTToken } = require("./middleware/authorizationMiddleware");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/bms/users", userRoute);
app.use("/bms/movies", validateJWTToken, movieRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
