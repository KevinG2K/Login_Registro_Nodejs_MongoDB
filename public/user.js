const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//las veces que va a necesitar para encriptar
//mayor nro de veces, mayor seguridad
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  username: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
});

//hacemos la encriptacion / guardar password
//pre -> operciones antes de que se guarden los datos
UserSchema.pre("save", function (next) {
  //método save
  //validamos si ese método save dentro de nuestra bd se ejecuta cuando es el dato es new o cuando modificamos algún campo
  if (this.isNew || this.isModified("password")) {
    //obtenemos la referencia de this
    const document = this;

    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      //validar si hay un error
      if (err) {
        //continue el flujo de nuestra función para la siguiente función
        next(err);
        //guardamos el hash en nuestra bd del campo password
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

//para el login, para comparar el pasword con el que tenemos guardado
// las 2 funciones se están llamando de forma síncrona -> cuando termina el procedimiento
// sigue el flujo de la app
UserSchema.methods.isCorrectPassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      //al final lo vamos a cachar en nuestro app.js
      callback(err, same);
    }
  });
};

//exportamos nuestro UserSchema
//UserSchema para que podamos hacer referencia en nuestro app.js
module.exports = mongoose.model("User", UserSchema);
