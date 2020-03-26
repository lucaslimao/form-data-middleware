const core = require('../core')

const express = fn => async (res, req, next) => {

    try {

        req = await core(req)

        return next()

    } catch (error) {

        return res.status(500).json({ error: 'Erro ao ler Form-Data' })

    }

}

module.exports = express