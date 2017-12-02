const crypto = require('crypto')

module.exports = app => {
    class UserService extends app.Service {
        async create(user) {
            const hmac = crypto.createHmac('sha256', this.config.pwdKey)
            hmac.update(user.password)
            user.password = hmac.digest('hex')
            return (await app.model.User(user).save()).toObject()
        }

        getByEmail(email) {
            return app.model.User.findOne({
                email
            }).lean()
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

        async find(param) {
            const reg = new RegExp(`.*${param.name}.*`, 'i')
            const cond = {
                invalid: false,
                $or: [{ name: reg }, { email: reg }]
            }
            const list = await app.model.User.find(cond)
                .sort({ modifiedTime: -1, createTime: -1 })
                .skip((param.page - 1) * param.limit)
                .limit(param.limit)
                .lean()
            const total = await app.model.User.find(cond).count()
            return {
                list: list.map(u => {
                    delete u.password
                    return u
                }),
                total
            }
        }

        updatePassword(email, password) {
            const hmac = crypto.createHmac('sha256', this.config.pwdKey)
            hmac.update(password)
            password = hmac.digest('hex')
            return app.model.User.findOneAndUpdate(
                {
                    email
                },
                {
                    password,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }

        updatePasswordByOldPassword(oldPassword, newPassword) {
            const hmac = crypto.createHmac('sha256', this.config.pwdKey)
            hmac.update(oldPassword)
            oldPassword = hmac.digest('hex')
            const hmac2 = crypto.createHmac('sha256', this.config.pwdKey)
            hmac2.update(newPassword)
            newPassword = hmac2.digest('hex')
            return app.model.User.findOneAndUpdate(
                {
                    _id: this.ctx.authUser._id,
                    password: oldPassword
                },
                {
                    password: newPassword,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }

        update(user) {
            const authId = this.ctx.authUser._id
            return app.model.User.findOneAndUpdate(
                {
                    _id: authId
                },
                {
                    name: user.name,
                    email: user.email,
                    modifiedTime: new Date()
                },
                { new: true }
            ).lean()
        }
    }

    return UserService
}
