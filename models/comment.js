const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        text: {type:String, required: true},
        author: {type: String, required: true},
        dateCreated: {type:Date, required: true},
        blogId: {type: Schema.Types.ObjectId, ref:"Blog", required:true}
    }
)

CommentSchema
    .virtual("url")
    .get(function(){
        return '/comment' + this._id
    })

module.exports = mongoose.model("Comment", CommentSchema)