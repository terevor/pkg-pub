'use strict'

module.exports = app => {
    class ProjectController extends app.Controller {
        async create() {
            const rs = await this.service.project.create(this.ctx.request.body)
            this.success(rs)
        }

        async update() {
            const rs = await this.service.project.update(this.ctx.request.body)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.success(rs)
        }

        async findAll() {
            const rs = await this.service.project.findList()
            this.success(rs)
        }

    }
    return ProjectController
}
