var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2')


var UserSchema = new mongoose.Schema({
    name: {type:String},
    lastname: {type:String},
    email: {type:String},
    password: {type:String, select: false },
    whitelist: {type:Array},
    // imgUser: String
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema, "users")

module.exports = User; 