'use strict'

module.exports = app => {
    class AbstractController extends app.Controller {
        success(data) {
            this.ctx.status = 200
            this.ctx.body = data
        }
        error(data, code = 403) {
            if (typeof data === 'string') {
                this.ctx.throw(code, data)
            } else {
                this.ctx.throw(data.code, data.message)
            }
        }
        notFound(msg) {
            msg = msg || 'not found'
            this.ctx.throw(404, msg)
        }
    }

    app.Controller = AbstractController
}
