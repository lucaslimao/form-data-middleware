const Busboy = require('busboy')
const { logger } = require('musii-node-helper')

module.exports = async (request, fromExpress = false) => {

    const busboy = new Busboy({
        headers: request.headers
    })

    if (fromExpress) {
        request.pipe(busboy)
    }

    return await new Promise((resolve, reject) => {

        logger.info('[FormData Middleware][Core] Start')
        
        const result = { }

        const files = []
        
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

            const fileRead = []

            file.on('data', data => {

                logger.info(`[FormData Middleware][Core] Data, ${filename}`)

                fileRead.push(data)         

            })

            file.on('end', function() {
          
                files.push({
                    file: Buffer.concat(fileRead),
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

            logger.info(`[FormData Middleware][Core] Finish. `)

            resolve(request)

        })
        
        if (!fromExpress) {

            busboy.write(request.body, request.isBase64Encoded ? 'base64' : 'binary')

            busboy.end()

        }

    })

}