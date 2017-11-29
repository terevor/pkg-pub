'use strict'

module.exports = app => {
    class VersionController extends app.Controller {
        async create() {
            const v = this.ctx.request.body
            v.creator = this.ctx.authUser.name
            const rs = await this.service.version.create(v)
            this.success(rs)
        }

        async update() {
            const rs = await this.service.version.update(this.ctx.request.body)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.success(rs)
        }

        async findAll() {
            const p = this.ctx.request.query
            const rs = await this.service.version.findList(p)
            this.success(rs)
        }

    }
    return VersionController
}
