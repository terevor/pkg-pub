module.exports = app => {
    class ModService extends app.Service {
        async create(mod) {
            return (await app.model
                .Mod(mod)
                .save()).toObject()
        }

        findList(cond = {}, order = {}) {
            return app.model.Mod.find(cond)
                .sort({
                    ...order,
                    modifiedTime: -1,
                    createTime: -1
                })
                .lean()
        }

        getById(id) {
            return app.model.Mod.findOne({
                _id: id
            })
        }

        findByVersionId(versionId) {
            return app.model.Mod.find({
                versionId: versionId
            })
        }

        find(q) {
            const reg = new RegExp(`.*${q}.*`, 'i')
            return app.model.Mod.find({
                name: reg
            })
        }

        update(mod) {
            return app.model.Mod
                .findOneAndUpdate(
                    {
                        _id: mod._id
                    },
                    {
                        name: mod.name,
                        desc: mod.desc,
                        url: mod.tags,
                        modifiedTime: new Date()
                    },
                    { new: true }
                )
                .lean()
        }

        remove(_id) {
            return app.model.Mod.remove({
                _id
            }).exec()
        }
    }

    return ModService
}
