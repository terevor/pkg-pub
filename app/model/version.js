module.exports = app => {
    const mongoose = app.mongoose
    const { ObjectId } = mongoose.Schema.Types

    const VersionSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        desc: String,
        projectId: ObjectId,
        creator: String,
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

    return mongoose.model('Version', VersionSchema)
}
