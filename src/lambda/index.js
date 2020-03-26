const core = require('../core')
const { logger } = require('musii-node-helper')

const lambda = fn => async (event, context, callback) => {

    try {

        logger.info('[FormData Middleware][Lambda] Start')

        event = await core(event)

    } catch (error) {

        logger.info(`[FormData Middleware][Lambda] Error, ${JSON.stringify(error)}`)

        return callback(null, { 
            statusCode: 500, 
            body: JSON.stringify({ error: `Erro ao ler Form-Data. ${error}` }) 
        })

    }

    return fn(event, context, callback)

}

module.exports = lambda