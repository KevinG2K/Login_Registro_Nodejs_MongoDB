const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

//apuntamos a nuestro modelo userSchema
const User = require("./public/user");

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//manda a llamar a public para cargar cotenido estatico
app.use(express.static(path.join(__dirname, "public")));

//mi BD
const mongo_uri = "mongodb://localhost:27017/todos";

// validamos conexión con mi DB
mongoose.connect(mongo_uri, function (err) {
  if (err) {
    throw err;
    // console.log(err);
  } else {
    console.log(`Conectado satisfactoriamente a ${mongo_uri}`);
  }
});

// app.get("/", (req, res) => res.send("Hello World!"));
app.post("/register", (req, res) => {
  //arriba usamos bodyParse, es para convertir este en json
  const { username, password } = req.body;

  const user = new User({ username, password });
  //llamamos al método para guardar nuestro usuario
  user.save((err) => {
    if (err) {
      res.status(500).send("ERROR AL REGISTRAR EL USUARIO");
    } else {
      res.status(200).send("USUARIO REGISTRADO");
    }
  });
});

app.post("/autenticacion", (req, res) => {
  //extraemos en variables
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).send("ERROR AL AUTENTICAR EL USUARIO");
    } else if (!user) {
      res.status(500).send("EL USUARIO NO EXISTE");
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send("ERROR AL AUTENTICAR");
        } else if (result) {
          res.status(200).send("USUARIO AUTENTICADO CORRECTAMENTE");
        } else {
          res.status(500).send("USUARIO Y/O CONTRASEÑA INCORRECTA");
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
