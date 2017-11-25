const md5 = require('blueimp-md5')

module.exports = app => {
    class UserService extends app.Service {
        async create(user) {
            return (await app.model
                .User({
                    email: user.email,
                    password: md5(user.password, this.config.pwdKey),
                    name: user.name
                })
                .save()).toObject()
        }

        getByEmail(email) {
            return app.model.User
                .findOne({
                    email
                })
                .lean()
        }

        getById(id) {
            return app.model.User.findOne({
                _id: id
            })
        }

        getByIds(ids) {
            return app.model.User.find({
                _id: {
                    $in: ids
                }
            })
        }

        find(q) {
            const reg = new RegExp(`.*${q}.*`, 'i')
            return app.model.User.find({
                invalid: false,
                $or: [{ name: reg }, { email: reg }]
            })
        }

        updatePassword(email, password) {
            return app.model.User
                .findOneAndUpdate(
                    {
                        email
                    },
                    {
                        password: md5(password, this.config.pwdKey),
                        modifiedTime: new Date()
                    },
                    { new: true }
                )
                .lean()
        }

        updatePasswordByOldPassword(oldPassword, newPassword) {
            return app.model.User
                .findOneAndUpdate(
                    {
                        _id: this.ctx.authUser._id,
                        password: md5(oldPassword, this.config.pwdKey)
                    },
                    {
                        password: md5(newPassword, this.config.pwdKey),
                        modifiedTime: new Date()
                    },
                    { new: true }
                )
                .lean()
        }

        update(user) {
            const authId = this.ctx.authUser._id
            return app.model.User
                .findOneAndUpdate(
                    {
                        _id: authId
                    },
                    {
                        name: user.name,
                        email: user.email,
                        modifiedTime: new Date()
                    },
                    { new: true }
                )
                .lean()
        }
    }

    return UserService
}
