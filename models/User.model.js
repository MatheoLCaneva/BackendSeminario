var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2')


var UserSchema = new mongoose.Schema({
    name: {type:String},
    lastname: {type:String},
    username: {type:String},
    email: {type:String},
    password: {type:String, select: false },
    whitelist: {type:Array},
    premium: {type:Boolean},
    // imgUser: String
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema, "users")

module.exports = User;