require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Start Swagger
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Retink Use Case Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Enes Demirtas",
        url: "https://github.com/EnesDemirtas",
        email: "enesdemirtas255@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

// End Swagger

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const blogsRouter = require("./routes/blogs");
app.use("/blogs", blogsRouter);

const authorsRouter = require("./routes/authors");
app.use("/authors", authorsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

app.listen(3000, () => console.log("Server started on port 3000"));
