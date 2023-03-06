const express = require("express");
const db = require("./db");
const routerCategories = require("./routes/categories");
const routerUser = require("./routes/users");
const routerFinances = require("./routes/finances");

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Olá, essa é a aplicação Wallet App!");
});

app.use("/categories", routerCategories);
app.use("/users", routerUser);
app.use("/finances", routerFinances);

app.listen(port, () => {
  db.connect()
    .then(() => {
      console.log("DB connected.");
    })
    .catch((error) => {
      throw new Error(error);
    });
  console.log(`Example app listening on port ${port}`);
});
