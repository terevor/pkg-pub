const Crypto = require('crypto')

module.exports = app => {
    class Ticket extends app.Service {
        create(id, act, maxAge = 15 * 60 * 1000) {
            const Cipher = Crypto.createCipher('aes192', this.config.pwdKey)
            const ticket = JSON.stringify({
                id,
                act,
                maxAge,
                date: new Date()
            })
            return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
        }

        check(ticket, act, id, modifiedTime) {
            const Decipher = Crypto.createDecipher('aes192', this.config.pwdKey)
            let rs
            try {
                rs =
                    Decipher.update(ticket, 'hex', 'utf8') +
                    Decipher.final('utf8')
                rs = JSON.parse(rs)
            } catch (err) {
                return { success: false, msg: '未知ticket，无法解析' }
            }
            const expires = +new Date(rs.date) + rs.maxAge
            if (expires < Date.now()) {
                return { success: false, msg: 'ticket已过期' }
            }
            if (act !== rs.act) {
                return { success: false, msg: 'ticket action错误' }
            }
            if (id && id !== rs.id) {
                return { success: false, msg: 'ticket验证无效' }
            }
            if (modifiedTime && modifiedTime > new Date(rs.date)) {
                return { success: false, msg: '原始信息发生变化，当前ticket自动失效' }
            }
            return { success: true, data: rs }
        }
    }

    return Ticket
}
