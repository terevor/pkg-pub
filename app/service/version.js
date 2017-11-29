module.exports = app => {
    class VersionService extends app.Service {
        async create(version) {
            return (await app.model.Version(version).save()).toObject()
        }

        findList(cond = {}, order = {}) {
            return app.model.Version.find(cond)
                .sort({
                    ...order,
                    modifiedTime: -1,
                    createTime: -1
                })
                .lean()
        }

        getById(id) {
            return app.model.Version.findOne({
                _id: id
            })
        }

        findByProjectId(projectId) {
            return app.model.Version.find({
                projectId: projectId
            })
        }

        find(q) {
            const reg = new RegExp(`.*${q}.*`, 'i')
            return app.model.Version.find({
                name: reg
            })
        }

        update(version) {
            return app.model.Version.findOneAndUpdate(
                {
                    _id: version._id
                },
                {
                    name: version.name,
                    desc: version.desc,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }

        remove(_id) {
            return app.model.Version.findOneAndUpdate(
                {
                    _id
                },
                {
                    invalid: true,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }
    }

    return VersionService
}
