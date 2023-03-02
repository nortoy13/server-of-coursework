import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.send("server is running");
});

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://nortoy13:nortoy13@cluster1.jmktdxc.mongodb.net/coursework", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 5000, () => console.log(`server running on port ${PORT}`))
  )
  .catch((err) => console.log(err.message));
