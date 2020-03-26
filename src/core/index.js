const Busboy = require('busboy')
const { logger } = require('musii-node-helper')

module.exports = async (request) => {

    return await new Promise((resolve, reject) => {

        logger.info('[FormData Middleware][Core] Start')

        const busboy = new Busboy({
            headers: request.headers
        })
        
        const result = { }

        const files = []
        
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

            file.on('data', data => {

                logger.info(`[FormData Middleware][Core] Data, ${filename}`)

                files.push({
                    file: data,
                    fileName: filename,
                    contentType: mimetype
                })

            })

        })
        
        busboy.on('field', (fieldname, value) => {

            try {
                result[fieldname] = JSON.parse(value)
            } catch (err) {

                logger.error(`[FormData Middleware][Core] Error, Field, ${fieldname}`)

                result[fieldname] = value

            }

        })
        
        busboy.on('error', error => reject(`Parse error: ${error}`))

        busboy.on('finish', () => {

            request.body = result
            request.files = files

            logger.info(`[FormData Middleware][Core] Finish, ${JSON.stringify(request)}`)

            resolve(request)

        })
        
        busboy.write(request.body, request.isBase64Encoded ? 'base64' : 'binary')

        busboy.end()

    })

}