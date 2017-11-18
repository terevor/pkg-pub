'use strict'

module.exports = app => {
    app.get('/', 'home.index')
    app.get('/list', 'pkg.list')
    app.get('/download', 'pkg.download')
}
