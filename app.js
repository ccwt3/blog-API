import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "idk what happend mate" });
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`Port listening at http://localhost:3000`);
});
