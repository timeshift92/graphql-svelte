//@ts-nocheck
/**
 * Asynchronously starts a given Koa app server that automatically closes when
 * the given test tears down.
 * @param {object} t Tap test.
 * @param {object} app Koa app.
 * @returns {Promise<number>} Promise resolving the Node.js net server port.
 * @ignore
 */
export const startServer = (app,port) =>
  new Promise((resolve, reject) => {
    app.listen(port,function (error) {
      if (error) reject(error)
      else {
        // t.tearDown(() => this.close())
        resolve({ port: this.address().port, server: this })
      }
    })
  })
