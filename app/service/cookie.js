module.exports = app => {
    class Cookie extends app.Service {
        set(key, value, config = {}) {
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
            this.ctx.cookies.set(
                key,
                value,
                Object.assign(
                    {
                        expires,
                        overwrite: true,
                        secure: false,
                        encrypt: true
                    },
                    config
                )
            )
        }

        get(key) {
            return this.ctx.cookies.get(key, {
                overwrite: true,
                encrypt: true
            })
        }

        setUser(user) {
            this.set('pkg-pub-user', JSON.stringify(user))
        }

        getUser() {
            try {
                return JSON.parse(this.get('pkg-pub-user'))
            } catch (e) {
                return null
            }
        }

        clearUser(user) {
            this.set('pkg-pub-user', '', {
                expires: Date.now()
            })
        }
    }

    return Cookie
}
