module.exports = (options, app) => {
    return async function auth(next) {
        if (this.request.url.indexOf('server') >= 0) {
            const user = this.service.cookie.getUser()
            if (user) {
                this.authUser = user
                await next
            } else {
                this.status = 401
            }
        } else {
            await next
        }
    }
}
