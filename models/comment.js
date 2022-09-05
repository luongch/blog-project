const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        title: {type: String, required: true},
        text: {type:String, required: true},
        author: {type: String, required: true},
        dateCreated: {type:Date, required: true},
        blogId: {type: Schema.Types.ObjectId, ref:"Blog", required:true}
    }
)

CommentScehma
    .virtual("url")
    .get(function(){
        return '/comment' + this._id
    })

module.exports = monmgoose.model("Comment", CommentSchema)