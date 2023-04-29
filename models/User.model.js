const { model, Schema } = require('mongoose')

const userSchema = new Schema(
    {
        username: String,
        email: String,
        password: String,
        craft: [String],
        years: Number
    },
    {
        timestamps: true
    }
)

module.exports = model('User', userSchema)