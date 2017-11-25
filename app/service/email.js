module.exports = app => {
    const mailer = require('nodemailer')
    const transporter = mailer.createTransport(app.config.transporter)

    class Email extends app.Service {
        sent(to, subject, html) {
            const { auth, appName } = this.config.transporter
            const mailOptions = {
                from: `${appName} <${auth.user}>`,
                to,
                subject,
                html
            }
            return transporter.sendMail(mailOptions).catch(error => {
                this.ctx.logger.info('Message %s sent error: %s', error)
                return error
            })
        }

        resetPassword(verifyCode, user) {
            const html = `
              <strong>重设密码</strong>
              <p>账户名：${user.name}</p>
              <p>验证码：${verifyCode}</p>
            `
            return this.sent(user.email, '重设密码', html)
        }

        passwordTicket(ticket, user) {
            const html = `
              <strong>找回密码</strong>
              <p>账户名：${user.name}</p>
              <p>链接：${app.config.clientRoot}/#/reset-pass?ticket=${ticket}</p>
            `
            return this.sent(user.email, '找回密码', html)
        }
    }

    return Email
}
