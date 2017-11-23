module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types

    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        title: [String],
        teamId: [ObjectId],
        createTime: {
            type: Date,
            default: Date.now
        },
        modifiedTime: {
            type: Date,
            default: Date.now
        },
        invalid: {
            type: Boolean,
            default: false
        }
    })

    return mongoose.model('User', UserSchema)
}
