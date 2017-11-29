'use strict'

module.exports = app => {
    app.get('/', 'home.index')
    app.get('/pkg/list', 'pkg.list')
    app.get('/pkg/list/all', 'pkg.listAll')
    app.get('/pkg/download', 'pkg.download')

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

    app.get('/project', 'project.findAll')
    app.post('/project', 'project.create')
    app.put('/project', 'project.update')

    app.get('/version', 'version.findAll')
    app.post('/version', 'version.create')
    app.put('/version', 'version.update')

    app.get('/mod', 'mod.findAll')
    app.post('/mod', 'mod.create')
    app.put('/mod', 'mod.update')
    app.delete('/mod/:id', 'mod.remove')
}
