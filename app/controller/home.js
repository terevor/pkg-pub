'use strict'

module.exports = app => {
    class HomeController extends app.Controller {
        async index() {
            this.ctx.body = 'pkg-pub server is running...'
        }
    }
    return HomeController
}
