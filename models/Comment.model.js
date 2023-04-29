const { model, Schema } = require('mongoose')

const commentSchema = new Schema(
    {
        username: { type: Schema.Types.ObjectId, ref: "User" },
        comment: String
    }
)

module.exports = model('Comment', commentSchema)