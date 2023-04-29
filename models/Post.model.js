const { model, Schema } = require('mongoose')

const postSchema = new Schema(
    {
        title: String,
        description: String,
        imageUrl: String,
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    }
)

module.exports = model('Post', postSchema)