'use strict'

module.exports = appInfo => {
    const config = (exports = {})

    config.middleware = ['errorHandler', 'auth']

    config.auth = {
        ignore(ctx) {
            return [
                '/auth/register',
                '/auth/login',
                '/auth/recovery/password/ticket',
                '/auth/recovery/password'
            ].includes(ctx.request.path)
        }
    }

    config.security = {
        csrf: {
            enable: false
        }
    }

    config.cluster = {
        listen: {
            port: 7007,
            hostname: '127.0.0.1'
        }
    }

    config.mongoose = {
        url: 'mongodb://127.0.0.1/pkg-pub'
    }

    // cookie_secret_key
    config.keys = `${appInfo.name}_1510021138212_8287`
    // password_secret_key
    config.pwdKey = 'k50$Mx7s!Fu'
    config.jwtKey = '37dU^j%8wD9'
    // mail config
    config.transporter = {
        appName: 'VCS',
        host: 'smtp.qq.com',
        secure: true,
        port: 465,
        auth: {
            user: '{{email_address}}',
            pass: '{{email_password}}'
        }
    }

    return config
}
