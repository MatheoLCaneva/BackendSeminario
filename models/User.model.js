var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2')


var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    whitelist: { type: Array },
    premium: { type: Boolean },
    validated: { type: Boolean },
    // imgUser: String
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema, "users")

module.exports = User;