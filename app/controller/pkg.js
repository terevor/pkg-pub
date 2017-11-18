'use strict'

const path = require('path')
const fs = require('fs')

module.exports = app => {
    class PkgController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.errorMap = {
                '-4058': '文件或目录不存在',
                '-4052': '您访问的不是一个文件夹'
            }
        }

        async list() {
            const { app, ctx, clearPath, errorMap } = this
            let { dir = '', type = '' } = ctx.query
            dir = clearPath(dir)
            const filePath = path.resolve(app.config.static.dir, dir)
            // ctx.logger.info(`list files --> ${filePath}`)
            try {
                let list = fs.readdirSync(filePath)
                const files = []
                list.forEach(file => {
                    const stat = fs.statSync(path.resolve(filePath, file))
                    if ((type === 'dir' && stat.isDirectory()) || (type !== 'dir' && stat.isFile())) {
                        files.push({
                            file,
                            time: stat.birthtimeMs
                        }) 
                    }
                })
                this.success({
                    files
                })
            } catch (err) {
                this.error(errorMap[err.errno] || err.message)
            }
        }

        async download() {
            const { app, ctx, clearPath, errorMap } = this
            let { dir = '', filename = '' } = ctx.query
            dir = clearPath(dir)
            filename = clearPath(filename)
            const filePath = path.resolve(app.config.static.dir, dir, filename)
            // ctx.logger.info(`download file --> ${filePath}`)
            try {
                const stat = fs.statSync(filePath)
                if (stat.isDirectory()) {
                    this.error('您请求下载的是目录而非文件')
                } else {
                    ctx.attachment(filename)
                    ctx.set('Content-Type', 'application/octet-stream')
                    ctx.body = fs.createReadStream(filePath)
                }
            } catch (err) {
                this.error(errorMap[err.errno] || err.message)
            }
        }

        clearPath(dir) {
            return dir.replace('../', './')
        }
    }
    return PkgController
}
