'use strict'

module.exports = app => {
    class ModController extends app.Controller {
        async create() {
            const mod = this.ctx.request.body
            mod.creator = this.ctx.authUser.name
            const rs = await this.service.mod.create(mod)
            this.success(rs)
        }

        async update() {
            const rs = await this.service.mod.update(this.ctx.request.body)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.success(rs)
        }

        async findAll() {
            const p = this.ctx.request.query
            const rs = await this.service.mod.findList(p)
            this.success(rs)
        }

        async remove() {
            await this.service.mod.remove(this.ctx.request.params.id)
            this.success(rs)
        }
    }
    return ModController
}
