const jwt = require('jsonwebtoken')

module.exports = (options, app) => {
    return async function auth(ctx, next) {
        const token =
            ctx.request.headers['x-access-token'] ||
            ctx.request.body.token ||
            ctx.request.query.token
        if (token) {
            try {
                ctx.authUser = jwt.verify(token, ctx.app.config.jwtKey)
                // console.dir(ctx.authUser);
                await next()
            } catch (err) {
                let message
                if (err.name === 'TokenExpiredError') {
                    message = 'token已过期，请重新登录'
                } else {
                    message = '无效的token.'
                }
                ctx.status = 401
                ctx.body = { error: message }
            }
        } else {
            ctx.status = 401
            ctx.body = {
                error: '非认证用户，禁止访问'
            }
        }
    }
}
