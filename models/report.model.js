var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2')

var ReportSchema = new mongoose.Schema({
    user: {type: String},
    description: {type: Object},
    date: {type: Date, default: Date.now},
    likes: {type: Number},
    likesBy: {type: Array}
})

ReportSchema.plugin(mongoosePaginate)
const Report = mongoose.model('Report', ReportSchema, "Reportes")

module.exports = Report;