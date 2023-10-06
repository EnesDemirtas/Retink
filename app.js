require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const blogsRouter = require("./routes/blogs");
app.use("/blogs", blogsRouter);

const authorsRouter = require("./routes/authors");
app.use("/authors", authorsRouter);

app.listen(3000, () => console.log("Server started on port 3000"));
