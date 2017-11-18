'use strict'

module.exports = appInfo => {
    const config = (exports = {})

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1510021138212_8287'

    // add your config here
    config.middleware = ['errorHandler']

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

    return config
}
