module.exports = app => {
    const mongoose = app.mongoose

    const ProjectSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        desc: String,
        tags: [String],
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

    return mongoose.model('Project', ProjectSchema)
}
