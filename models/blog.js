const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
    {
        title: {type: String, required: true},
        text: {type:String, required: true},
        author: {type: String, required: true},
        dateCreated: {type:Date, required: true},
        dateUpdated: {type: Date, required: false}
    }
)

BlogSchema
    .virtual("url")
    .get(function(){
        return '/blog' + this._id
    })

module.exports = mongoose.model("Blog", BlogSchema)