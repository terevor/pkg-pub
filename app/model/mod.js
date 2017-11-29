module.exports = app => {
    const mongoose = app.mongoose
    const { ObjectId } = mongoose.Schema.Types

    const ModSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        desc: String,
        url: [String],
        versionId: ObjectId,
        creator: String,
        createTime: {
            type: Date,
            default: Date.now
        },
        modifiedTime: {
            type: Date,
            default: Date.now
        }
    })

    return mongoose.model('Mod', ModSchema)
}
