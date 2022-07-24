const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//structure d'un user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);//vérification que l'email de l'utilisateur soit unique

module.exports = mongoose.model('User', userSchema);