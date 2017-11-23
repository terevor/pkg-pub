'use strict'

module.exports = app => {
    app.get('/', 'home.index')
    app.get('/list', 'pkg.list')
    app.get('/download', 'pkg.download')

    app.get('/auth/user', 'user.get')
    app.post('/auth/register', 'user.create')
    app.post('/auth/login', 'user.login')
    app.get('/auth/logout', 'user.logout')
    app.post('/auth/recovery/password/ticket', 'user.sentResetPassTicket')
    app.post('/auth/recovery/password/code', 'user.sentResetPassCode')
    app.put('/auth/recovery/password', 'user.resetPasswordByTicket')
    app.put('/user/password', 'user.updatePassword')
    app.put('/user', 'user.update')
    app.get('/user/search', 'user.search')
}
