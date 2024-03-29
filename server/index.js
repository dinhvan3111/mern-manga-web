require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const mangaRouter = require("./routes/manga");
const genreRouter = require("./routes/genre");
const chapterRouter = require("./routes/chapter");
const favouriteMangaRouter = require("./routes/favouriteManga");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uy42yxm.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/manga", mangaRouter);
app.use("/api/genre", genreRouter);
app.use("/api/chapter", chapterRouter);
app.use("/api/favourite", favouriteMangaRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
