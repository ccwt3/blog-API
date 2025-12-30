// librarys
import express from "express";
const app = express();

// modules
import authRouter from "./routes/authRouter";
import postsRouter from "./routes/postsRouter";
import usersRouter from "./routes/usersRouter"

// config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use("/auth", authRouter)
app.use("/posts", postsRouter)
app.use("/users", usersRouter)

// running server
app.use((err, req, res, next) => {
  res.status(500).json({ message: "idk what happend mate" });
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`Port listening at http://localhost:3000`);
});
