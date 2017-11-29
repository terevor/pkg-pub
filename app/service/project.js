module.exports = app => {
    class ProjectService extends app.Service {
        async create(project) {
            return (await app.model.Project(project).save()).toObject()
        }

        async findListPaged(cond = {}, page = 1, limit = 10, order = {}) {
            const list = await app.model.Project.find(cond)
                .sort({ ...order, modifiedTime: -1, createTime: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
            // list.map(x => x.toObject())
            const total = await app.model.Project.find(cond)
                .count()
                .exec()
            return {
                list,
                total,
                page,
                limit
            }
        }

        findList(cond = {}, order = {}) {
            return app.model.Project.find(cond)
                .sort({
                    ...order,
                    modifiedTime: -1,
                    createTime: -1
                })
                .lean()
        }

        getById(id) {
            return app.model.Project.findOne({
                _id: id
            })
        }

        findByIds(ids) {
            return app.model.Project.find({
                _id: {
                    $in: ids
                }
            })
        }

        find(q) {
            const reg = new RegExp(`.*${q}.*`, 'i')
            return app.model.Project.find({
                invalid: false,
                name: reg
            })
        }

        update(project) {
            return app.model.Project.findOneAndUpdate(
                {
                    _id: project._id
                },
                {
                    name: project.name,
                    desc: project.desc,
                    tags: project.tags,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }

        remove(_id) {
            return app.model.Project.findOneAndUpdate(
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

    return ProjectService
}
