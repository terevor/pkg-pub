'use strict'

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

module.exports = app => {
    class UserController extends app.Controller {
        async search() {
            let { name = '', page = 1, limit = 10 } = this.ctx.query
            page = Number(page)
            limit = Number(limit)
            const rs = await this.service.user.find({
                name,
                page,
                limit
            })
            this.success(rs)
        }

        async sentResetPassCode() {
            const { email } = this.ctx.request.body
            const user = await this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const key = 'password_' + user._id
            const hasCode = this.service.cache.has(key)
            if (hasCode) {
                this.error('验证码5分钟内有效，请勿重复发送')
            }
            const code = this.service.cache.verifyCodeCache(key, 6,  5 * 1000 * 60)
            const rs = await this.service.email.resetPassword(code, user)
            if (rs && rs.messageId) {
                this.success(true)
            } else {
                this.error('发送验证码失败，请重试')
            }
        }

        async sentResetPassTicket() {
            const { email } = this.ctx.request.body
            const user = await this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const ticket = this.service.ticket.create(user._id, 'password')
            const rs = await this.service.email.passwordTicket(ticket, user)
            if (rs && rs.messageId) {
                this.success(true)
            } else {
                this.error('发送邮件失败，请重试')
            }
        }

        async resetPasswordByTicket() {
            const { email, password, ticket } = this.ctx.request.body
            const user = await this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const encode = this.service.ticket.check(
                ticket,
                'password',
                user._id.toString(),
                user.modifiedTime
            )
            if (!encode.success) {
                this.error(encode.msg)
            }
            const rs = await this.service.user.updatePassword(email, password)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.success(true)
        }

        async resetPassword() {
            const { email, password, verifyCode } = this.ctx.request.body
            const user = await this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const key = 'password_' + user._id
            const hasCode = this.service.cache.has(key)
            if (!hasCode) {
                this.error('验证码已过期，请重新申请')
            }
            const correctCode = this.service.cache.get(key)
            if (correctCode !== verifyCode) {
                this.ctx.logger.info(
                    'verifyCode error',
                    `correctCode: ${correctCode}，verifyCode: ${verifyCode}`
                )
                this.error('验证码错误')
            }
            const rs = await this.service.user.updatePassword(email, password)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.service.cache.del(key)
            this.success(true)
        }

        async get() {
            const rs = this.ctx.authUser
            if (!rs || !rs._id) {
                this.error('未登录', 401)
            }
            const user = await this.service.user.getById(rs._id)
            if (!user || user.modifiedTime > new Date(rs.modifiedTime)) {
                this.error('用户信息已发生变更，请重新登录', 401)
            }
            this.success(rs)
        }

        async create() {
            const info = this.ctx.request.body
            const user = await this.service.user.getByEmail(info.email)
            if (user) {
                this.error('此邮箱已被注册')
            }
            const rs = await this.service.user.create(info)
            delete rs.password
            // this.service.cookie.setUser(rs)
            this.success(rs)
        }

        async login() {
            let { email, password } = this.ctx.request.body
            if (!email || !password) {
                this.error('认证失败，请输入账号和密码')
            }
            email = email.replace(/[^\.\-\_\@0-9a-zA-Z]+/g, '')
            const user = await this.service.user.getByEmail(email)
            if (!user) {
                this.error('账号不存在')
            }
            const hmac = crypto.createHmac('sha256', this.config.pwdKey)
            hmac.update(password)
            password = hmac.digest('hex')
            if (user.password !== password) {
                this.error('密码错误')
            }
            delete user.password
            user.token = jwt.sign(user, this.config.jwtKey, {
                expiresIn: '24h' // 设置过期时间
            })
            // this.service.cookie.setUser(user)
            this.success(user)
        }

        async update() {
            const user = this.ctx.request.body
            const rs = await this.service.user.update(user)
            if (!rs) {
                this.error('修改失败', 500)
            }
            delete rs.password
            // this.service.cookie.setUser(rs)
            this.success(rs)
        }

        async updatePassword() {
            const {
                originPassword,
                password,
                verifyPassword
            } = this.ctx.request.body
            if (
                originPassword.trim() === '' ||
                password.trim() === '' ||
                verifyPassword.trim() === ''
            ) {
                this.error('信息不能为空')
            }
            if (password !== verifyPassword) {
                this.error('确认密码不一致')
            }
            const rs = await this.service.user.updatePasswordByOldPassword(
                originPassword,
                password
            )
            if (!rs) {
                this.error('密码错误')
            }
            delete rs.password
            // this.service.cookie.setUser(rs)
            this.success(rs)
        }

        logout() {
            // this.service.cookie.clearUser()
            this.success('注销成功')
        }
    }

    return UserController
}
