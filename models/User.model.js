const { model, Schema } = require('mongoose')

const userSchema = new Schema(
    {
        username: String,
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        craft: [String],
        years: String,
        imageUrl: String
    },
    {
        timestamps: true
    }
)

module.exports = model('User', userSchema)